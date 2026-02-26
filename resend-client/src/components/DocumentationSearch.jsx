import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, X, FileText, Hash } from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";

const DocumentationSearch = ({ isOpen, onClose, sections }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    background,
    foreground,
    primary,
    primaryForeground,
    card,
    border,
    muted,
    mutedForeground,
    hover,
  } = useThemeStyles();

  // helper for preview trimming
  const getSearchPreview = (text, query) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text.substring(0, 100);

    const start = Math.max(0, index - 40);
    const end = Math.min(text.length, index + query.length + 60);
    let preview = text.substring(start, end);

    if (start > 0) preview = "..." + preview;
    if (end < text.length) preview = preview + "...";

    return preview;
  };

  // scoring
  const calculateRelevance = (titleMatch, descMatch, contentCount) => {
    let score = 0;
    if (titleMatch) score += 10;
    if (descMatch) score += 5;
    score += contentCount * 2;
    return score;
  };

  // search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return sections.map((section) => ({
        ...section,
        type: "section",
        matches: [],
      }));
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    sections.forEach((section) => {
      const titleMatch = section.title.toLowerCase().includes(query);
      const descriptionMatch = section.description
        ?.toLowerCase()
        .includes(query);
      const contentMatches = [];

      if (section.content) {
        section.content.forEach((item) => {
          const itemText = item.toLowerCase();
          if (itemText.includes(query)) {
            contentMatches.push({
              text: item,
              preview: getSearchPreview(item, query),
            });
          }
        });
      }

      if (section.subsections) {
        section.subsections.forEach((sub) => {
          const subTitleMatch = sub.title.toLowerCase().includes(query);
          const subContentMatch = sub.content?.toLowerCase().includes(query);

          if (subTitleMatch || subContentMatch) {
            contentMatches.push({
              text: sub.title,
              isSubsection: true,
              preview: sub.content
                ? getSearchPreview(sub.content, query)
                : sub.title,
            });
          }
        });
      }

      if (titleMatch || descriptionMatch || contentMatches.length > 0) {
        results.push({
          ...section,
          titleMatch,
          descriptionMatch,
          contentMatches,
          relevance: calculateRelevance(
            titleMatch,
            descriptionMatch,
            contentMatches.length
          ),
        });
      }
    });

    return results.sort((a, b) => b.relevance - a.relevance);
  }, [searchQuery, sections]);

  // keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          handleResultClick(searchResults[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, searchResults]);

  useEffect(() => setSelectedIndex(0), [searchQuery]);

  const handleResultClick = (result) => {
    const element = document.getElementById(result.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      onClose();
      setSearchQuery("");
    }
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          style={{
            backgroundColor: primary.color,
            color: primaryForeground.color,
            padding: "0 2px",
            borderRadius: "2px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center md:pt-[10vh] pt-0 h-full"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden
          md:h-auto h-full md:rounded-lg rounded-none
          md:my-0 my-0
        "
        style={{
          backgroundColor: card.color,
          border: `1px solid ${border.color}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          className="flex items-center gap-3 p-4 border-b"
          style={{ borderColor: border.color }}
        >
          <Search size={20} style={{ color: mutedForeground.color }} />
          <input
            type="text"
            placeholder="Search documentation..."
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-base"
            style={{
              backgroundColor: "transparent",
              color: foreground.color,
            }}
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 rounded hover:opacity-70 transition-opacity"
              style={{ color: mutedForeground.color }}
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="p-1 rounded hover:opacity-70 transition-opacity"
              style={{ color: mutedForeground.color }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="lg:max-h-[60vh] md:max-h-[70vh] h-full overflow-y-auto flex-1">
          {searchResults.length === 0 ? (
            <div
              className="p-8 text-center flex flex-col items-center justify-center h-full"
              style={{ color: mutedForeground.color }}
            >
              <Search size={48} className="mb-3 opacity-30" />
              <p>No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="p-2 lg:mb-0 mb-10">
              {!searchQuery.trim() && (
                <div
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: mutedForeground.color }}
                >
                  All Sections
                </div>
              )}

              {searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 rounded-lg mb-1 transition-all duration-150"
                  style={{
                    backgroundColor:
                      selectedIndex === index
                        ? hover.background
                        : "transparent",
                    color: foreground.color,
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-1 p-1.5 rounded"
                      style={{
                        backgroundColor: muted.color,
                        color: primary.color,
                      }}
                    >
                      {<result.icon /> || <FileText size={16} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1">
                        {highlightText(result.title, searchQuery)}
                      </div>

                      {result.description && (
                        <div
                          className="text-sm mb-2"
                          style={{ color: mutedForeground.color }}
                        >
                          {highlightText(
                            result.description.substring(0, 100),
                            searchQuery
                          )}
                          {result.description.length > 100 && "..."}
                        </div>
                      )}

                      {searchQuery.trim() &&
                        result.contentMatches.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {result.contentMatches
                              .slice(0, 2)
                              .map((match, i) => (
                                <div
                                  key={i}
                                  className="text-xs flex items-start gap-2 p-2 rounded"
                                  style={{
                                    backgroundColor: muted.color,
                                    color: mutedForeground.color,
                                  }}
                                >
                                  <Hash
                                    size={12}
                                    className="mt-0.5 flex-shrink-0"
                                  />
                                  <span className="line-clamp-2">
                                    {highlightText(match.preview, searchQuery)}
                                  </span>
                                </div>
                              ))}
                            {result.contentMatches.length > 2 && (
                              <div
                                className="text-xs px-2"
                                style={{ color: primary.color }}
                              >
                                +{result.contentMatches.length - 2} more matches
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-3 text-xs border-t"
          style={{
            backgroundColor: muted.color,
            color: mutedForeground.color,
            borderColor: border.color,
          }}
        >
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd
                className="px-2 py-1 rounded"
                style={{
                  backgroundColor: background.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd
                className="px-2 py-1 rounded"
                style={{
                  backgroundColor: background.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                ↵
              </kbd>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd
              className="px-2 py-1 rounded"
              style={{
                backgroundColor: background.color,
                border: `1px solid ${border.color}`,
              }}
            >
              ESC
            </kbd>
            Close
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DocumentationSearch;
