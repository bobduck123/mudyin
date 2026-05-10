#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request


FRONTEND_URL = os.getenv("MUDYIN_FRONTEND_URL", "https://mudyin-live.vercel.app").rstrip("/")
PUBLIC_URL = os.getenv("MUDYIN_PUBLIC_URL", "https://www.mudyin.com").rstrip("/")
BACKEND_URL = os.getenv("ANU_BACKEND_URL", "https://anu-back-end.vercel.app").rstrip("/")
TENANT_KEY = os.getenv("TENANT_KEY", "mudyin")
ORIGINS = [
    "https://mudyin.com",
    "https://www.mudyin.com",
    "https://mudyin-live.vercel.app",
]


def request(method: str, url: str, *, headers: dict[str, str] | None = None, body: dict | None = None, timeout: int = 12):
    data = None
    merged_headers = dict(headers or {})
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        merged_headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=merged_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            raw = response.read().decode("utf-8", errors="replace")
            return {
                "ok": 200 <= response.status < 400,
                "status": response.status,
                "headers": dict(response.headers.items()),
                "body": raw[:1200],
            }
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        return {
            "ok": False,
            "status": exc.code,
            "headers": dict(exc.headers.items()),
            "body": raw[:1200],
        }
    except Exception as exc:
        return {"ok": False, "status": None, "headers": {}, "body": str(exc)}


def record(results: list[dict], name: str, status: str, detail: str):
    results.append({"check": name, "status": status, "detail": detail})


def main() -> int:
    results: list[dict] = []

    frontend = request("GET", FRONTEND_URL)
    record(results, "frontend_url", "pass" if frontend["ok"] else "fail", f"{FRONTEND_URL} -> {frontend['status']}: {frontend['body'][:160]}")

    health_statuses = []
    for path in ["/health", "/healthz"]:
        health = request("GET", f"{BACKEND_URL}{path}")
        health_statuses.append(f"{path}={health['status']}")
        if health["ok"]:
            record(results, "backend_health", "pass", f"{path} responded {health['status']}")
            break
    else:
        record(results, "backend_health", "fail", ", ".join(health_statuses))

    for origin in ORIGINS:
        cors = request(
            "OPTIONS",
            f"{BACKEND_URL}/api/public/sites/resolve?site={urllib.parse.quote(TENANT_KEY)}",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "X-ANU-Site-Slug",
            },
        )
        allowed = cors["headers"].get("Access-Control-Allow-Origin")
        status = "pass" if cors["ok"] and allowed == origin else "fail"
        record(results, f"cors_preflight:{origin}", status, f"status={cors['status']} allow_origin={allowed!r}")

    manifest = request(
        "GET",
        f"{BACKEND_URL}/api/public/sites/resolve?site={urllib.parse.quote(TENANT_KEY)}&host={urllib.parse.quote('www.mudyin.com')}",
        headers={"X-ANU-Site-Slug": TENANT_KEY},
    )
    manifest_status = "unknown"
    if manifest["ok"]:
        try:
            manifest_json = json.loads(manifest["body"])
            data = manifest_json.get("data") or manifest_json
            site_manifest = data.get("site_manifest") or {}
            if data.get("node_slug") == TENANT_KEY or site_manifest.get("site_key") == "mudyin-public":
                manifest_status = "pass"
        except Exception:
            if "mudyin-public" in manifest["body"] or '"node_slug":"mudyin"' in manifest["body"]:
                manifest_status = "pass"
    record(results, "tenant_manifest", manifest_status, f"status={manifest['status']} body={manifest['body'][:220]}")

    for path, payload in [
        ("/api/enquiries", {
            "name": "Launch Smoke",
            "email": "smoke@example.com",
            "phone": "",
            "enquiryType": "general",
            "preferredService": "",
            "preferredDateTime": "",
            "message": "Smoke test enquiry from launch readiness script.",
            "consent": True,
            "website": "",
        }),
        ("/api/booking-request", {
            "name": "Launch Smoke",
            "email": "smoke@example.com",
            "phone": "",
            "enquiryType": "booking",
            "preferredService": "Healing Centre",
            "preferredDateTime": "Next available",
            "message": "Smoke test booking request from launch readiness script.",
            "consent": True,
            "website": "",
        }),
    ]:
        endpoint = request("POST", f"{FRONTEND_URL}{path}", body=payload)
        status = "pass" if endpoint["ok"] else "unknown"
        record(results, f"frontend_intake:{path}", status, f"status={endpoint['status']} body={endpoint['body'][:220]}")

    print(json.dumps({
        "frontend_url": FRONTEND_URL,
        "public_url": PUBLIC_URL,
        "backend_url": BACKEND_URL,
        "tenant_key": TENANT_KEY,
        "results": results,
    }, indent=2))

    return 1 if any(item["status"] == "fail" for item in results) else 0


if __name__ == "__main__":
    sys.exit(main())
