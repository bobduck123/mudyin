'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface TagAutocompleteProps {
  value: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
}

export function TagAutocomplete({
  value,
  onChange,
  maxTags = 10,
}: TagAutocompleteProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions
  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/gallery/tags?search=${encodeURIComponent(inputValue)}`
        )
        if (!response.ok) throw new Error('Failed to fetch tags')

        const data = await response.json()
        setSuggestions(
          data.tags.filter((tag: string) => !value.includes(tag))
        )
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Tag fetch error:', error)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, value])

  const handleAddTag = (tag: string) => {
    if (value.includes(tag) || value.length >= maxTags) return

    onChange([...value, tag])
    setInputValue('')
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleRemoveTag = (tag: string) => {
    onChange(value.filter(t => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleAddTag(suggestions[selectedIndex])
      } else if (inputValue.trim()) {
        handleAddTag(inputValue.trim())
      }
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault()
      setSelectedIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <div
        className="p-3 rounded-lg border border-gray-300 focus-within:ring-2 flex flex-wrap gap-2 items-start"
      >
        {/* Selected Tags */}
        {value.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--color-ochre-400)' }}
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:opacity-75"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        {/* Input */}
        {value.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={
              value.length > 0 ? '' : 'Add tags... (max 10)'
            }
            className="flex-1 min-w-[100px] outline-none bg-transparent text-sm"
          />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="max-h-48 overflow-y-auto rounded-lg border border-gray-300 shadow-lg"
          style={{ backgroundColor: 'white' }}
        >
          {suggestions.map((tag, index) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddTag(tag)}
              onMouseEnter={() => setSelectedIndex(index)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
              style={{
                backgroundColor:
                  selectedIndex === index
                    ? 'rgba(210, 168, 85, 0.1)'
                    : 'transparent',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-600">
        {value.length}/{maxTags} tags
      </p>
    </div>
  )
}
