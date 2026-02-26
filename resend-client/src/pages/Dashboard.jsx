import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { getDashboardData } = useAuth();
  const {
    background,
    foreground,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    mutedForeground,
    card,
    border,
    hover,
    theme,
  } = useThemeStyles();

  const fetchData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await getDashboardData(currentPage, statusFilter);
      if (res) {
        setData(res);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, statusFilter]);

  if (loading && !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: background.color }}
      >
        <div className="text-center space-y-4">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto"
            style={{
              borderColor: `${primary.color} transparent ${primary.color} ${primary.color}`,
            }}
          />
          <p style={{ color: mutedForeground.color }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: background.color }}
      >
        <div
          className="p-8 rounded-lg text-center"
          style={{
            backgroundColor: card.color,
            border: `1px solid ${border.color}`,
          }}
        >
          <XCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p
            className="text-lg font-semibold mb-2"
            style={{ color: foreground.color }}
          >
            Failed to load dashboard data
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-6 py-2 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { summary, recentEmails, pagination } = data;

  const pieData = [
    { name: "Sent", value: summary?.sentEmails || 0, color: "#22c55e" },
    { name: "Failed", value: summary?.failedEmails || 0, color: "#ef4444" },
    { name: "Pending", value: summary?.pendingEmails || 0, color: "#f59e0b" },
  ];

  // Stats cards configuration
  const statsCards = [
    {
      label: "Total Emails",
      value: summary?.totalEmails || 0,
      icon: Mail,
      color: primary.color,
      bgColor: theme === "light" ? "#f5f5f5" : "#1a1a1a",
    },
    {
      label: "Sent Successfully",
      value: summary?.sentEmails || 0,
      icon: CheckCircle2,
      color: "#22c55e",
      bgColor: theme === "light" ? "#dcfce7" : "#14532d",
    },
    {
      label: "Failed",
      value: summary?.failedEmails || 0,
      icon: XCircle,
      color: "#ef4444",
      bgColor: theme === "light" ? "#fee2e2" : "#7f1d1d",
    },
    {
      label: "Pending",
      value: summary?.pendingEmails || 0,
      icon: Clock,
      color: "#f59e0b",
      bgColor: theme === "light" ? "#fef3c7" : "#78350f",
    },
  ];

  return (
    <div
      className="p-4 md:p-6 lg:p-8 transition-colors"
      style={{ backgroundColor: background.color }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: foreground.color }}
            >
              Dashboard Overview
            </h1>
            <p
              style={{ color: mutedForeground.color }}
              className="text-sm md:text-base"
            >
              Monitor your email activity and performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div
                className="text-sm px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: secondary.color,
                  color: mutedForeground.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
              style={{
                backgroundColor: primary.color,
                color: primaryForeground.color,
              }}
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: card.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                  <TrendingUp
                    size={20}
                    style={{ color: mutedForeground.color }}
                  />
                </div>
                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: mutedForeground.color }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: foreground.color }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div
            className="rounded-xl p-6 shadow-sm transition-all"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
            }}
          >
            <h2
              className="text-lg font-semibold mb-6 flex items-center gap-2"
              style={{ color: foreground.color }}
            >
              <BarChart size={20} style={{ color: primary.color }} />
              Email Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={[
                  { name: "Sent", value: summary?.sentEmails || 0 },
                  { name: "Failed", value: summary?.failedEmails || 0 },
                  { name: "Pending", value: summary?.pendingEmails || 0 },
                ]}
              >
                <XAxis
                  dataKey="name"
                  stroke={mutedForeground.color}
                  style={{ fontSize: "14px" }}
                />
                <YAxis
                  stroke={mutedForeground.color}
                  allowDecimals={false}
                  style={{ fontSize: "14px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: card.color,
                    border: `1px solid ${border.color}`,
                    borderRadius: "8px",
                    color: foreground.color,
                  }}
                  cursor={{ fill: hover.background }}
                />
                <Bar
                  dataKey="value"
                  fill={primary.color}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div
            className="rounded-xl p-6 shadow-sm transition-all"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
            }}
          >
            <h2
              className="text-lg font-semibold mb-6 flex items-center gap-2"
              style={{ color: foreground.color }}
            >
              <TrendingUp size={20} style={{ color: primary.color }} />
              Performance Overview
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: card.color,
                    border: `1px solid ${border.color}`,
                    borderRadius: "8px",
                    color: foreground.color,
                  }}
                />
                <Legend
                  wrapperStyle={{ color: foreground.color, fontSize: "14px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {summary?.lastSent && (
          <div
            className="rounded-xl p-6 shadow-sm transition-all"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: theme === "light" ? "#f5f5f5" : "#1a1a1a",
                }}
              >
                <CheckCircle2 size={20} style={{ color: "#22c55e" }} />
              </div>
              <h2
                className="text-lg font-semibold"
                style={{ color: foreground.color }}
              >
                Last Sent Email
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: mutedForeground.color }}
                >
                  Recipient
                </p>
                <p className="font-medium" style={{ color: foreground.color }}>
                  {summary.lastSent.to}
                </p>
              </div>
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: mutedForeground.color }}
                >
                  Subject
                </p>
                <p
                  className="font-medium truncate"
                  style={{ color: foreground.color }}
                >
                  {summary.lastSent.subject || "(No subject)"}
                </p>
              </div>
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: mutedForeground.color }}
                >
                  Sent At
                </p>
                <p
                  className="font-medium flex items-center gap-1"
                  style={{ color: foreground.color }}
                >
                  <Calendar size={16} />
                  {new Date(summary.lastSent.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Emails Table */}
        <div
          className="rounded-xl shadow-sm overflow-hidden transition-all"
          style={{
            backgroundColor: card.color,
            border: `1px solid ${border.color}`,
          }}
        >
          {/* Table Header */}
          <div className="p-6 border-b" style={{ borderColor: border.color }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2
                className="text-lg font-semibold flex items-center gap-2"
                style={{ color: foreground.color }}
              >
                <Mail size={20} style={{ color: primary.color }} />
                Recent Emails
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter size={18} style={{ color: mutedForeground.color }} />
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{
                      backgroundColor: secondary.color,
                      color: secondaryForeground.color,
                      borderColor: border.color,
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="sent">Sent</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Export Button */}
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: secondary.color,
                    color: secondaryForeground.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: secondary.color,
                    color: secondaryForeground.color,
                  }}
                >
                  <th className="text-left py-4 px-6 font-semibold text-sm">
                    Subject
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">
                    Recipient
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-sm">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {!recentEmails || recentEmails.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-12"
                      style={{ color: mutedForeground.color }}
                    >
                      <Mail size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="text-lg font-medium">No emails found</p>
                      <p className="text-sm mt-1">
                        {statusFilter !== "all"
                          ? `No ${statusFilter} emails to display`
                          : "Start sending emails to see them here"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  recentEmails.map((email, index) => (
                    <tr
                      key={email._id}
                      className="border-t transition-colors"
                      style={{
                        borderColor: border.color,
                        backgroundColor:
                          index % 2 === 0 ? "transparent" : hover.background,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          hover.background;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          index % 2 === 0 ? "transparent" : hover.background;
                      }}
                    >
                      <td
                        className="px-6 py-4"
                        style={{ color: foreground.color }}
                      >
                        <div className="font-medium max-w-xs truncate">
                          {email.subject || "(No subject)"}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4"
                        style={{ color: foreground.color }}
                      >
                        <div className="max-w-xs truncate">{email.to}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor:
                              email.status === "sent"
                                ? theme === "light"
                                  ? "#dcfce7"
                                  : "#14532d"
                                : email.status === "failed"
                                ? theme === "light"
                                  ? "#fee2e2"
                                  : "#7f1d1d"
                                : theme === "light"
                                ? "#fef3c7"
                                : "#78350f",
                            color:
                              email.status === "sent"
                                ? "#22c55e"
                                : email.status === "failed"
                                ? "#ef4444"
                                : "#f59e0b",
                          }}
                        >
                          {email.status === "sent" && (
                            <CheckCircle2 size={12} />
                          )}
                          {email.status === "failed" && <XCircle size={12} />}
                          {email.status === "pending" && <Clock size={12} />}
                          {email.status.charAt(0).toUpperCase() +
                            email.status.slice(1)}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ color: mutedForeground.color }}
                      >
                        {new Date(email.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Backend-Driven Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t"
              style={{ borderColor: border.color }}
            >
              <p className="text-sm" style={{ color: mutedForeground.color }}>
                Showing page {pagination.page} of {pagination.totalPages} (
                {pagination.totalFiltered} total emails)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: secondary.color,
                    color: secondaryForeground.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10 h-10 rounded-lg font-medium transition-all"
                          style={{
                            backgroundColor:
                              currentPage === pageNum
                                ? primary.color
                                : secondary.color,
                            color:
                              currentPage === pageNum
                                ? primaryForeground.color
                                : secondaryForeground.color,
                            border: `1px solid ${border.color}`,
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="px-2"
                          style={{ color: mutedForeground.color }}
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: secondary.color,
                    color: secondaryForeground.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
