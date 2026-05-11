#!/usr/bin/env python3
"""Live launch diagnostics for Mudyin DNS, HTTPS, redirects, and key routes."""

from __future__ import annotations

import datetime as dt
import json
import os
import re
import socket
import ssl
import urllib.error
import urllib.request
from dataclasses import dataclass, asdict
from typing import Any


PUBLIC_URL = os.getenv("MUDYIN_PUBLIC_URL", "https://www.mudyin.com").rstrip("/")
APEX_HOST = os.getenv("MUDYIN_APEX_HOST", "mudyin.com")
WWW_HOST = os.getenv("MUDYIN_WWW_HOST", "www.mudyin.com")

KEY_ROUTES = [
    "/",
    "/contact",
    "/programs",
    "/programs/thrive-tribe",
    "/programs/young-spirit-mentoring",
    "/programs/culture-country",
]


@dataclass
class Check:
    check: str
    status: str
    detail: str


class TrackingRedirectHandler(urllib.request.HTTPRedirectHandler):
    def __init__(self) -> None:
        self.redirects: list[str] = []
        super().__init__()

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # type: ignore[override]
        self.redirects.append(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch(url: str, method: str = "GET", timeout: int = 15) -> dict[str, Any]:
    handler = TrackingRedirectHandler()
    opener = urllib.request.build_opener(handler)
    request = urllib.request.Request(url, method=method, headers={"User-Agent": "mudyin-launch-diagnostics/1.0"})

    try:
        with opener.open(request, timeout=timeout) as response:
            body = response.read(250_000)
            return {
                "ok": True,
                "status": response.status,
                "url": response.url,
                "redirects": handler.redirects,
                "headers": dict(response.headers),
                "body": body.decode("utf-8", errors="replace"),
            }
    except urllib.error.HTTPError as error:
        body = error.read(20_000).decode("utf-8", errors="replace")
        return {
            "ok": False,
            "status": error.code,
            "url": error.url,
            "redirects": handler.redirects,
            "headers": dict(error.headers),
            "body": body,
            "error": str(error),
        }
    except Exception as error:  # noqa: BLE001 - diagnostics should report all failures
        return {
            "ok": False,
            "status": None,
            "url": url,
            "redirects": handler.redirects,
            "headers": {},
            "body": "",
            "error": str(error),
        }


def dns_check(host: str) -> Check:
    try:
        records = sorted({item[4][0] for item in socket.getaddrinfo(host, None, proto=socket.IPPROTO_TCP)})
        return Check(f"dns:{host}", "pass" if records else "fail", ", ".join(records) or "no records")
    except Exception as error:  # noqa: BLE001
        return Check(f"dns:{host}", "fail", str(error))


def cert_check(host: str) -> Check:
    try:
        context = ssl.create_default_context()
        with socket.create_connection((host, 443), timeout=12) as sock:
            with context.wrap_socket(sock, server_hostname=host) as tls:
                cert = tls.getpeercert()

        sans = [value for key, value in cert.get("subjectAltName", []) if key == "DNS"]
        not_after_raw = cert.get("notAfter", "")
        not_after = dt.datetime.strptime(not_after_raw, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=dt.timezone.utc)
        now = dt.datetime.now(dt.timezone.utc)
        covers = host in sans
        valid = not_after > now
        status = "pass" if covers and valid else "fail"
        return Check(
            f"tls-cert:{host}",
            status,
            f"covers={covers} expires={not_after.isoformat()} sans={sans}",
        )
    except Exception as error:  # noqa: BLE001
        return Check(f"tls-cert:{host}", "fail", str(error))


def redirect_check(url: str, expected_final: str) -> Check:
    result = fetch(url, method="GET")
    final_url = result["url"].rstrip("/")
    expected = expected_final.rstrip("/")
    if result["ok"] and final_url == expected and not final_url.startswith("http://") and "mudyin-live.vercel.app" not in final_url:
        return Check(f"redirect:{url}", "pass", f"final={result['url']} redirects={result['redirects']}")
    return Check(
        f"redirect:{url}",
        "fail",
        f"status={result['status']} final={result['url']} redirects={result['redirects']} error={result.get('error', '')}",
    )


def route_check(path: str) -> Check:
    result = fetch(f"{PUBLIC_URL}{path}", method="GET")
    headers = {key.lower(): value for key, value in result["headers"].items()}
    matched = headers.get("x-anu-domain-resolution")
    status = "pass" if result["status"] == 200 else "fail"
    return Check(
        f"route:{path}",
        status,
        f"status={result['status']} final={result['url']} domain_resolution={matched}",
    )


def mixed_content_check() -> Check:
    result = fetch(PUBLIC_URL, method="GET")
    if not result["ok"]:
        return Check("mixed-content:home", "fail", f"homepage fetch failed: {result.get('error', result['status'])}")

    body = result["body"]
    insecure = sorted(set(re.findall(r"https?://[^\"'<> )]+", body)))
    insecure = [url for url in insecure if url.startswith("http://") and "schema.org" not in url and "w3.org" not in url]
    if insecure:
        return Check("mixed-content:home", "fail", "; ".join(insecure[:10]))
    return Check("mixed-content:home", "pass", "no http:// asset URLs found in initial HTML")


def main() -> int:
    expected_final = PUBLIC_URL
    checks: list[Check] = [
        dns_check(APEX_HOST),
        dns_check(WWW_HOST),
        cert_check(APEX_HOST),
        cert_check(WWW_HOST),
        redirect_check(f"http://{APEX_HOST}", expected_final),
        redirect_check(f"http://{WWW_HOST}", expected_final),
        redirect_check(f"https://{APEX_HOST}", expected_final),
        redirect_check(f"https://{WWW_HOST}", expected_final),
        mixed_content_check(),
    ]
    checks.extend(route_check(path) for path in KEY_ROUTES)

    payload = {
        "public_url": PUBLIC_URL,
        "checked_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "results": [asdict(check) for check in checks],
    }
    print(json.dumps(payload, indent=2))

    return 1 if any(check.status == "fail" for check in checks) else 0


if __name__ == "__main__":
    raise SystemExit(main())
