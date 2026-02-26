import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  Mail,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileCode,
} from "lucide-react";

import { useEmailTemplate } from "../context/EmailTemplateContext";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import TemplatePreviewModal from "../components/TemplatePreviewModal";

const TAB_CONFIG = {
  PUBLIC: "public",
  MY: "my",
};

const ITEMS_PER_PAGE = 9;

const EmailTemplate = () => {
  const {
    publicTemplates,
    myTemplates,
    pagination,
    loading,
    fetchPublicTemplates,
    fetchMyTemplates,
  } = useEmailTemplate();
  const { user } = useAuth();

  const theme = useThemeStyles();
  const {
    background,
    card,
    border,
    primary,
    foreground,
    mutedForeground,
    primaryForeground,
  } = theme;

  const [activeTab, setActiveTab] = useState(TAB_CONFIG.PUBLIC);
  const [clientPage, setClientPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState("template");

  // Track if initial fetch has been done for each tab
  const hasFetchedPublic = useRef(false);
  const hasFetchedMy = useRef(false);

  // Memoize fetch functions to prevent infinite loops
  const fetchPublicData = useCallback(() => {
    if (!hasFetchedPublic.current) {
      hasFetchedPublic.current = true;
      fetchPublicTemplates({ page: 1, limit: 10 });
    }
  }, [fetchPublicTemplates]);

  const fetchMyData = useCallback(() => {
    if (!hasFetchedMy.current) {
      hasFetchedMy.current = true;
      fetchMyTemplates();
    }
  }, [fetchMyTemplates]);

  // FETCH DATA BASED ON TAB - Only fetch once per tab
  useEffect(() => {
    setClientPage(1);

    if (activeTab === TAB_CONFIG.PUBLIC) {
      fetchPublicData();
    } else {
      fetchMyData();
    }
  }, [activeTab, fetchPublicData, fetchMyData]);

  // DATA SOURCE
  const displayedTemplates =
    activeTab === TAB_CONFIG.PUBLIC ? publicTemplates : myTemplates;

  // CLIENT PAGINATION
  const totalClientPages = Math.ceil(
    displayedTemplates.length / ITEMS_PER_PAGE
  );

  const startIndex = (clientPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedTemplates = displayedTemplates.slice(startIndex, endIndex);

  const handleClientPageChange = (page) => {
    if (page < 1 || page > totalClientPages) return;
    setClientPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // LOAD MORE (PUBLIC ONLY)
  const handleLoadMore = async () => {
    if (!pagination?.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    await fetchPublicTemplates({
      page: pagination.page + 1,
      limit: pagination.limit,
    });
    setIsLoadingMore(false);
  };

  return (
    <div
      className="min-h-screen p-1 sm:p-4 md:p-6"
      style={{ backgroundColor: background.color }}
    >
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 px-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1
              className="text-2xl md:text-3xl font-bold flex items-center gap-2"
              style={{ color: foreground.color }}
            >
              <Mail
                className="w-6 h-6 md:w-7 md:h-7"
                style={{ color: primary.color }}
              />
              Email Templates
            </h1>
            <p
              className="text-xs sm:text-sm mt-1"
              style={{ color: mutedForeground.color }}
            >
              Manage and reuse email templates
            </p>
          </div>

          <Link
            to="/create-template"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-center whitespace-nowrap self-start sm:self-center"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
            }}
          >
            + Create Template
          </Link>
        </div>

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {user &&
            Object.values(TAB_CONFIG).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor:
                    activeTab === tab ? primary.color : card.color,
                  color:
                    activeTab === tab
                      ? primaryForeground.color
                      : foreground.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                {tab === "public" ? "Public Templates" : "My Templates"}
              </motion.button>
            ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-2">
        {loading && displayedTemplates.length === 0 && (
          <div className="flex justify-center py-16 sm:py-20">
            <Loader2
              className="w-10 h-10 sm:w-12 sm:h-12 animate-spin"
              style={{ color: primary.color }}
            />
          </div>
        )}

        {!loading && displayedTemplates.length === 0 && (
          <div
            className="text-center py-16 sm:py-20 rounded-xl mx-2"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
            }}
          >
            <p
              className="text-sm sm:text-base"
              style={{ color: mutedForeground.color }}
            >
              No templates found
            </p>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedTemplates.map((template) => (
            <motion.div
              key={template._id}
              className="rounded-xl p-5 flex flex-col h-full"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <div
                className="flex items-center gap-3 mb-4 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor: background.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                <img
                  src={template.owner?.profilePic}
                  alt={template.owner?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: foreground.color }}
                >
                  {template.owner?.name}
                </p>
              </div>

              <h3
                className="font-semibold mb-3 line-clamp-2"
                style={{ color: foreground.color }}
              >
                {template.subject}
              </h3>

              <div
                className="flex-1 mb-4 rounded-lg overflow-hidden text-sm"
                style={{
                  backgroundColor: background.color,
                  border: `1px solid ${border.color}`,
                  maxHeight: "110px",
                }}
              >
                <div
                  className="p-3 scale-[0.9] origin-top pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: template.html }}
                />
              </div>

              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setPreviewMode("template");
                    setIsPreviewOpen(true);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: primary.color,
                    color: primaryForeground.color,
                  }}
                >
                  <Eye size={16} />
                  Preview
                </button>

                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setPreviewMode("details");
                    setIsPreviewOpen(true);
                  }}
                  className="px-3 py-2.5 rounded-lg transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: background.color,
                    border: `1px solid ${border.color}`,
                    color: foreground.color,
                  }}
                  aria-label="View details"
                >
                  <FileCode size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CLIENT PAGINATION */}
        {totalClientPages > 1 && (
          <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-2">
            <button
              onClick={() => handleClientPageChange(clientPage - 1)}
              disabled={clientPage === 1}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${border.color}`,
                color: foreground.color,
              }}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span
              className="text-sm sm:text-base"
              style={{ color: mutedForeground.color }}
            >
              {clientPage} / {totalClientPages}
            </span>

            <button
              onClick={() => handleClientPageChange(clientPage + 1)}
              disabled={clientPage === totalClientPages}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${border.color}`,
                color: foreground.color,
              }}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* LOAD MORE (PUBLIC ONLY) */}
        {activeTab === TAB_CONFIG.PUBLIC && pagination?.hasNextPage && (
          <div className="flex justify-center mt-6 sm:mt-8 px-2">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
              style={{
                backgroundColor: primary.color,
                color: primaryForeground.color,
              }}
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        template={selectedTemplate}
        previewMode={previewMode}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};

export default EmailTemplate;
