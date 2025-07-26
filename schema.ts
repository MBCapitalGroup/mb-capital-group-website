import { pgTable, text, serial, integer, boolean, decimal, numeric, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const investmentOpportunities = pgTable("investment_opportunities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  units: integer("units").notNull(),
  propertyClass: text("property_class").notNull(),
  targetIrr: decimal("target_irr", { precision: 5, scale: 2 }).notNull(),
  cashOnCash: decimal("cash_on_cash", { precision: 5, scale: 2 }).notNull(),
  status: text("status").notNull(), // "Active", "Coming Soon", "Closed"
  imageUrl: text("image_url").notNull(),
  description: text("description"),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  hiddenFromWebsite: boolean("hidden_from_website").default(false).notNull(),
});

export const educationalResources = pgTable("educational_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  type: text("type").notNull(), // "Market Report", "Guide", "Webinar"
  imageUrl: text("image_url").notNull(),
  downloadUrl: text("download_url"),
});

export const consultationRequests = pgTable("consultation_requests", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  investmentRange: text("investment_range"),
  message: text("message"),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketReportRequests = pgTable("market_report_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  marketId: text("market_id").notNull(),
  marketName: text("market_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  published: boolean("published").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  imageUrl: text("image_url"),
  // SEO Blog System fields
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  focusKeyword: text("focus_keyword"),
  seoKeywords: text("seo_keywords"),
  articleCategory: text("article_category"),
  readingTime: integer("reading_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "consultation", "newsletter", "investor"
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  investmentAmount: text("investment_amount"),
  fundingSource: text("funding_source"),
  accreditedStatus: text("accredited_status"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const investorPortalAccounts = pgTable("investor_portal_accounts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password").notNull(), // Added for investor portal login
  accreditedStatus: text("accredited_status").notNull(), // "Accredited", "Non-Accredited", "Pending"
  totalInvestment: decimal("total_investment", { precision: 12, scale: 2 }).default("0").notNull(),
  activeInvestments: integer("active_investments").default(0).notNull(),
  accountStatus: text("account_status").default("Active").notNull(), // "Active", "Inactive", "Pending"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  blogPostId: integer("blog_post_id").references(() => blogPosts.id),
  customMessage: text("custom_message"),
  status: text("status").default("pending").notNull(), // "pending", "processing", "completed", "failed"
  totalRecipients: integer("total_recipients").default(0).notNull(),
  emailsSent: integer("emails_sent").default(0).notNull(),
  emailsFailed: integer("emails_failed").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
  completedAt: timestamp("completed_at"),
});

export const investorPropertyInvestments = pgTable("investor_property_investments", {
  id: serial("id").primaryKey(),
  investorId: integer("investor_id").references(() => investorPortalAccounts.id).notNull(),
  propertyId: integer("property_id").references(() => investmentOpportunities.id).notNull(),
  investmentAmount: decimal("investment_amount", { precision: 12, scale: 2 }).notNull(),
  equityPercentage: decimal("equity_percentage", { precision: 5, scale: 2 }),
  investmentDate: timestamp("investment_date").defaultNow().notNull(),
  notes: text("notes"),
  status: text("status").default("Active").notNull(), // "Active", "Closed", "Pending"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// K1 Tax Documents Management
export const k1TaxDocuments = pgTable("k1_tax_documents", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => investmentOpportunities.id),
  taxYear: integer("tax_year").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(), // This matches the actual database column
  fileSize: integer("file_size"),
  status: text("status").default("pending").notNull(), // pending, available, sent
  notes: text("notes"),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const k1InvestorAssignments = pgTable("k1_investor_assignments", {
  id: serial("id").primaryKey(),
  k1DocumentId: integer("k1_document_id").references(() => k1TaxDocuments.id).notNull(),
  investorId: integer("investor_id").references(() => investorPortalAccounts.id).notNull(),
  emailSent: boolean("email_sent").default(false).notNull(),
  emailSentAt: timestamp("email_sent_at"),
  downloadedAt: timestamp("downloaded_at"),
  downloadCount: integer("download_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Investor Invitations Management
export const investorInvitations = pgTable("investor_invitations", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SEO Guide & Training Tables
export const seoKeywords = pgTable("seo_keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  difficulty: integer("difficulty"), // 1-100 scale
  volume: integer("volume"), // monthly search volume
  position: integer("position"), // current ranking position
  url: text("url"), // page currently ranking
  competitor: text("competitor"), // main competitor for this keyword
  priority: text("priority").notNull().default("medium"), // high, medium, low
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentCalendar = pgTable("content_calendar", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  contentType: text("content_type").notNull(), // blog, email, social, video
  status: text("status").notNull().default("planned"), // planned, writing, review, published
  targetKeywords: text("target_keywords").array(),
  publishDate: timestamp("publish_date"),
  author: text("author"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const seoAudits = pgTable("seo_audits", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  auditType: text("audit_type").notNull(), // technical, content, local
  status: text("status").notNull().default("pending"), // pending, running, completed, failed
  score: integer("score"), // 0-100 SEO score
  issues: text("issues").array(),
  recommendations: text("recommendations").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const chatgptPrompts = pgTable("chatgpt_prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // blog, email, social, analysis
  prompt: text("prompt").notNull(),
  description: text("description"),
  useCount: integer("use_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const keywordTracking = pgTable("keyword_tracking", {
  id: serial("id").primaryKey(),
  keywords: text("keywords").array().notNull(),
  competitor: text("competitor"),
  location: text("location"),
  status: text("status").notNull().default("active"), // active, paused, stopped
  rankings: text("rankings"), // JSON string for ranking data
  lastChecked: timestamp("last_checked"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const markets = pgTable("markets", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  marketId: text("market_id").notNull().unique(), // slug format: kansas-city-mo
  medianRent: integer("median_rent").notNull(),
  occupancyRate: numeric("occupancy_rate").notNull(),
  populationGrowth: numeric("population_growth").notNull(),
  jobGrowth: numeric("job_growth").notNull(),
  unemploymentRate: numeric("unemployment_rate").notNull(),
  medianIncome: integer("median_income").notNull(),
  crimeScore: integer("crime_score").notNull(),
  walkScore: integer("walk_score").notNull(),
  rentGrowthYoY: numeric("rent_growth_yoy").notNull(),
  vacancyTrend: text("vacancy_trend").notNull(),
  constructionPermits: integer("construction_permits").notNull(),
  pricePerUnit: integer("price_per_unit").notNull(),
  capRateAverage: numeric("cap_rate_average").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Market = typeof markets.$inferSelect;
export type InsertMarket = typeof markets.$inferInsert;

export const blogEmailQueue = pgTable("blog_email_queue", {
  id: serial("id").primaryKey(),
  blogPostId: integer("blog_post_id").notNull().references(() => blogPosts.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  isSent: boolean("is_sent").default(false).notNull(),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogEmailRecipients = pgTable("blog_email_recipients", {
  id: serial("id").primaryKey(),
  queueId: integer("queue_id").notNull().references(() => blogEmailQueue.id),
  email: text("email").notNull(),
  recipientName: text("recipient_name"),
  recipientType: text("recipient_type").notNull(), // 'investor' or 'newsletter'
  emailSent: boolean("email_sent").default(false).notNull(),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlogEmailQueue = typeof blogEmailQueue.$inferSelect;
export type InsertBlogEmailQueue = typeof blogEmailQueue.$inferInsert;
export type BlogEmailRecipient = typeof blogEmailRecipients.$inferSelect;
export type InsertBlogEmailRecipient = typeof blogEmailRecipients.$inferInsert;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertInvestmentOpportunitySchema = createInsertSchema(investmentOpportunities).omit({
  id: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
});

export const insertEducationalResourceSchema = createInsertSchema(educationalResources).omit({
  id: true,
});

export const insertConsultationRequestSchema = createInsertSchema(consultationRequests).omit({
  id: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertMarketReportRequestSchema = createInsertSchema(marketReportRequests).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Investor Portal System
export const investors = pgTable('investors', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone'),
  accreditationStatus: text('accreditation_status').default('pending'), // 'verified', 'pending', 'not_accredited'
  totalInvested: decimal('total_invested', { precision: 12, scale: 2 }).default('0'),
  activeDeals: integer('active_deals').default(0),
  status: text('status').default('active'), // 'active', 'inactive', 'suspended'
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const investorInvitationsNew = pgTable('investor_invitations_new', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  invitationToken: text('invitation_token').unique().notNull(),
  status: text('status').default('pending'), // 'pending', 'accepted', 'expired', 'cancelled'
  expiresAt: timestamp('expires_at').notNull(),
  invitedBy: integer('invited_by').references(() => users.id).notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const dealInvestments = pgTable('deal_investments', {
  id: serial('id').primaryKey(),
  investorId: integer('investor_id').references(() => investors.id).notNull(),
  propertyId: integer('property_id').references(() => investmentOpportunities.id).notNull(),
  investmentAmount: decimal('investment_amount', { precision: 12, scale: 2 }).notNull(),
  equityPercentage: decimal('equity_percentage', { precision: 5, scale: 2 }),
  investmentDate: timestamp('investment_date').defaultNow().notNull(),
  status: text('status').default('active'), // 'active', 'exited', 'pending'
  distributionsReceived: decimal('distributions_received', { precision: 12, scale: 2 }).default('0'),
  currentValue: decimal('current_value', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const investorDocuments = pgTable('investor_documents', {
  id: serial('id').primaryKey(),
  investorId: integer('investor_id').references(() => investors.id).notNull(),
  dealInvestmentId: integer('deal_investment_id').references(() => dealInvestments.id),
  documentType: text('document_type').notNull(), // 'quarterly_report', 'k1_tax', 'distribution_notice', 'operating_agreement'
  title: text('title').notNull(),
  filePath: text('file_path'),
  fileSize: integer('file_size'),
  quarterYear: text('quarter_year'), // e.g., 'Q1_2025'
  isPublic: boolean('is_public').default(false),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const investorCommunications = pgTable('investor_communications', {
  id: serial('id').primaryKey(),
  investorId: integer('investor_id').references(() => investors.id).notNull(),
  subject: text('subject').notNull(),
  messageBody: text('message_body').notNull(),
  communicationType: text('communication_type').notNull(), // 'email', 'portal_message', 'sms'
  status: text('status').default('sent'), // 'sent', 'delivered', 'read', 'failed'
  sentBy: integer('sent_by').references(() => users.id).notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const investorPortalAccess = pgTable('investor_portal_access', {
  id: serial('id').primaryKey(),
  investorId: integer('investor_id').references(() => investors.id).notNull(),
  passwordHash: text('password_hash').notNull(),
  lastPasswordChange: timestamp('last_password_change').defaultNow().notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: text('two_factor_secret'),
  loginAttempts: integer('login_attempts').default(0),
  lockedUntil: timestamp('locked_until'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Type exports for investor portal
export type Investor = typeof investors.$inferSelect;
export type InsertInvestor = typeof investors.$inferInsert;
export type InvestorInvitationNew = typeof investorInvitationsNew.$inferSelect;
export type InsertInvestorInvitationNew = typeof investorInvitationsNew.$inferInsert;
export type DealInvestment = typeof dealInvestments.$inferSelect;
export type InsertDealInvestment = typeof dealInvestments.$inferInsert;
export type InvestorDocument = typeof investorDocuments.$inferSelect;
export type InsertInvestorDocument = typeof investorDocuments.$inferInsert;

// Click Heatmap Data Tracking
export const clickHeatmapData = pgTable("click_heatmap_data", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  elementSelector: text("element_selector").notNull(),
  clickX: integer("click_x").notNull(),
  clickY: integer("click_y").notNull(),
  elementX: integer("element_x").notNull(),
  elementY: integer("element_y").notNull(),
  elementWidth: integer("element_width").notNull(),
  elementHeight: integer("element_height").notNull(),
  screenWidth: integer("screen_width").notNull(),
  screenHeight: integer("screen_height").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

// Section Time Tracking
export const sectionTimeTracking = pgTable("section_time_tracking", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  sectionId: text("section_id").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
  entryTime: timestamp("entry_time").notNull(),
  exitTime: timestamp("exit_time").notNull(),
  scrollDepth: integer("scroll_depth").default(0), // percentage
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

// Add type exports
export type ClickHeatmapData = typeof clickHeatmapData.$inferSelect;
export type InsertClickHeatmapData = typeof clickHeatmapData.$inferInsert;
export type SectionTimeTracking = typeof sectionTimeTracking.$inferSelect;
export type InsertSectionTimeTracking = typeof sectionTimeTracking.$inferInsert;

// Insert schemas for investor portal
export const insertInvestorSchema = createInsertSchema(investors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvestorInvitationNewSchema = createInsertSchema(investorInvitationsNew).omit({
  id: true,
  createdAt: true,
});

export const insertDealInvestmentSchema = createInsertSchema(dealInvestments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertInvestorPortalAccountSchema = createInsertSchema(investorPortalAccounts).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({
  id: true,
  createdAt: true,
  sentAt: true,
  completedAt: true,
});

export const insertInvestorPropertyInvestmentSchema = createInsertSchema(investorPropertyInvestments).omit({
  id: true,
  createdAt: true,
});

// Syndication Documents Distribution System
export const syndicationDocuments = pgTable("syndication_documents", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  originalFileName: text("original_file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  documentType: text("document_type").notNull(), // "syndication", "wire_instructions", "offering_memorandum", "operating_agreement"
  description: text("description"),
  uploadedBy: integer("uploaded_by").references(() => adminUsers.id).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const syndicationDistributions = pgTable("syndication_distributions", {
  id: serial("id").primaryKey(),
  batchName: text("batch_name").notNull(),
  subject: text("subject").notNull(),
  message: text("message"),
  sentBy: integer("sent_by").references(() => adminUsers.id).notNull(),
  totalRecipients: integer("total_recipients").notNull(),
  successfulSends: integer("successful_sends").default(0).notNull(),
  failedSends: integer("failed_sends").default(0).notNull(),
  status: text("status").default("pending").notNull(), // "pending", "sending", "completed", "failed"
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const syndicationDocumentDistributions = pgTable("syndication_document_distributions", {
  id: serial("id").primaryKey(),
  distributionId: integer("distribution_id").references(() => syndicationDistributions.id).notNull(),
  documentId: integer("document_id").references(() => syndicationDocuments.id).notNull(),
});

export const syndicationRecipients = pgTable("syndication_recipients", {
  id: serial("id").primaryKey(),
  distributionId: integer("distribution_id").references(() => syndicationDistributions.id).notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  contactSource: text("contact_source").notNull(), // "manual", "consultation_requests", "form_submissions", "investor_portal_accounts", "newsletter_subscriptions"
  contactId: integer("contact_id"), // reference to source table ID
  emailStatus: text("email_status").default("pending").notNull(), // "pending", "sent", "delivered", "failed", "bounced"
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  errorMessage: text("error_message"),
});

// Type exports for syndication system
export type SyndicationDocument = typeof syndicationDocuments.$inferSelect;
export type InsertSyndicationDocument = typeof syndicationDocuments.$inferInsert;
export type SyndicationDistribution = typeof syndicationDistributions.$inferSelect;
export type InsertSyndicationDistribution = typeof syndicationDistributions.$inferInsert;
export type SyndicationDocumentDistribution = typeof syndicationDocumentDistributions.$inferSelect;
export type InsertSyndicationDocumentDistribution = typeof syndicationDocumentDistributions.$inferInsert;
export type SyndicationRecipient = typeof syndicationRecipients.$inferSelect;
export type InsertSyndicationRecipient = typeof syndicationRecipients.$inferInsert;

// Insert schemas for syndication system
export const insertSyndicationDocumentSchema = createInsertSchema(syndicationDocuments).omit({
  id: true,
  uploadedAt: true,
});

export const insertSyndicationDistributionSchema = createInsertSchema(syndicationDistributions).omit({
  id: true,
  sentAt: true,
  completedAt: true,
});

export const insertSyndicationRecipientSchema = createInsertSchema(syndicationRecipients).omit({
  id: true,
  sentAt: true,
  deliveredAt: true,
});

export const insertK1TaxDocumentSchema = createInsertSchema(k1TaxDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertK1InvestorAssignmentSchema = createInsertSchema(k1InvestorAssignments).omit({
  id: true,
  createdAt: true,
});

export const insertInvestorInvitationSchema = createInsertSchema(investorInvitations).omit({
  id: true,
  createdAt: true,
});

export const insertSeoKeywordSchema = createInsertSchema(seoKeywords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentCalendarSchema = createInsertSchema(contentCalendar).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSeoAuditSchema = createInsertSchema(seoAudits).omit({
  id: true,
  createdAt: true,
});

export const insertChatgptPromptSchema = createInsertSchema(chatgptPrompts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  useCount: true,
});

export const insertKeywordTrackingSchema = createInsertSchema(keywordTracking).omit({
  id: true,
  createdAt: true,
});

// AI Recommendations Lead Capture
export const aiRecommendationLeads = pgTable("ai_recommendation_leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  investmentAmount: text("investment_amount"),
  riskTolerance: text("risk_tolerance"),
  preferredMarkets: text("preferred_markets"), // JSON string of selected markets
  investmentGoals: text("investment_goals"), // JSON string of selected goals
  recommendationsData: text("recommendations_data"), // JSON string of full recommendations
  createdAt: timestamp("created_at").defaultNow().notNull(),
  emailSent: boolean("email_sent").default(false).notNull(),
});

export const insertAiRecommendationLeadSchema = createInsertSchema(aiRecommendationLeads).omit({
  id: true,
  createdAt: true,
  emailSent: true,
});

export const insertMarketSchema = createInsertSchema(markets).pick({
  city: true,
  state: true,
  marketId: true,
  medianRent: true,
  occupancyRate: true,
  populationGrowth: true,
  jobGrowth: true,
  unemploymentRate: true,
  medianIncome: true,
  crimeScore: true,
  walkScore: true,
  rentGrowthYoY: true,
  vacancyTrend: true,
  constructionPermits: true,
  pricePerUnit: true,
  capRateAverage: true,
  isActive: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type InvestorPortalAccount = typeof investorPortalAccounts.$inferSelect;
export type InsertInvestorPortalAccount = z.infer<typeof insertInvestorPortalAccountSchema>;

export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;

export type InvestorPropertyInvestment = typeof investorPropertyInvestments.$inferSelect;
export type InsertInvestorPropertyInvestment = z.infer<typeof insertInvestorPropertyInvestmentSchema>;

export type K1TaxDocument = typeof k1TaxDocuments.$inferSelect;
export type InsertK1TaxDocument = z.infer<typeof insertK1TaxDocumentSchema>;

export type K1InvestorAssignment = typeof k1InvestorAssignments.$inferSelect;
export type InsertK1InvestorAssignment = z.infer<typeof insertK1InvestorAssignmentSchema>;

export type InvestorInvitation = typeof investorInvitations.$inferSelect;
export type InsertInvestorInvitation = z.infer<typeof insertInvestorInvitationSchema>;

export type SeoKeyword = typeof seoKeywords.$inferSelect;
export type InsertSeoKeyword = z.infer<typeof insertSeoKeywordSchema>;

export type ContentCalendarEntry = typeof contentCalendar.$inferSelect;
export type InsertContentCalendarEntry = z.infer<typeof insertContentCalendarSchema>;

export type SeoAudit = typeof seoAudits.$inferSelect;
export type InsertSeoAudit = z.infer<typeof insertSeoAuditSchema>;

export type ChatgptPrompt = typeof chatgptPrompts.$inferSelect;
export type InsertChatgptPrompt = z.infer<typeof insertChatgptPromptSchema>;

export type KeywordTracking = typeof keywordTracking.$inferSelect;
export type InsertKeywordTracking = z.infer<typeof insertKeywordTrackingSchema>;

export type AiRecommendationLead = typeof aiRecommendationLeads.$inferSelect;
export type InsertAiRecommendationLead = z.infer<typeof insertAiRecommendationLeadSchema>;

// Market types are already defined above near the table definition

// Analytics type for admin dashboard
export type AdminAnalytics = {
  totalSubmissions: number;
  totalBlogPosts: number;
  totalOpportunities: number;
  totalTeamMembers: number;
  submissionsByType: Record<string, number>;
  recentSubmissions: FormSubmission[];
};

// Dashboard stats type
export type DashboardStats = {
  totalSubmissions: number;
  publishedPosts: number;
  teamMembers: number;
  investmentOpportunities: number;
};

// Form submissions response type
export type FormSubmissionsResponse = {
  formSubmissions: FormSubmission[];
  newsletterSubscribers: NewsletterSubscription[];
};

// Blog management response types
export type BlogPostsResponse = BlogPost[];

export type BlogPostCreateRequest = InsertBlogPost;
export type BlogPostUpdateRequest = Partial<InsertBlogPost>;

// Team management response types
export type TeamMembersResponse = TeamMember[];

// Investment properties response types
export type InvestmentPropertiesResponse = InvestmentOpportunity[];

// Markets response types  
export type MarketsResponse = Market[];

// Investor portal response types
export type InvestorPortalAccountsResponse = InvestorPortalAccount[];

export type InvestorInvitationsResponse = InvestorInvitation[];

// Email campaign response types
export type EmailCampaignsResponse = EmailCampaign[];
export type EmailStatsResponse = {
  totalSubscribers: number;
  publishedPosts: number;
  emailsSent: number;
  activeCampaigns: number;
};

export type TeamMemberCreateRequest = InsertTeamMember;
export type TeamMemberUpdateRequest = Partial<InsertTeamMember>;

export type InvestmentOpportunity = typeof investmentOpportunities.$inferSelect;
export type InsertInvestmentOpportunity = z.infer<typeof insertInvestmentOpportunitySchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type EducationalResource = typeof educationalResources.$inferSelect;
export type InsertEducationalResource = z.infer<typeof insertEducationalResourceSchema>;

export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type InsertConsultationRequest = z.infer<typeof insertConsultationRequestSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

// Tax Calculator Management Tables
export const taxBrackets = pgTable("tax_brackets", {
  id: serial("id").primaryKey(),
  taxYear: integer("tax_year").notNull(),
  filingStatus: text("filing_status").notNull(), // single, marriedJointly, marriedSeparately, headOfHousehold
  incomeFrom: decimal("income_from", { precision: 12, scale: 2 }).notNull(),
  incomeTo: decimal("income_to", { precision: 12, scale: 2 }), // null for highest bracket
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull(), // percentage
  jurisdiction: text("jurisdiction").notNull(), // federal, state, local
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const depreciationRules = pgTable("depreciation_rules", {
  id: serial("id").primaryKey(),
  propertyType: text("property_type").notNull(), // residential, commercial, land-improvements, personal-property, furniture-fixtures
  depreciationMethod: text("depreciation_method").notNull(), // straight-line, macrs, cost-segregation, section-179, bonus
  usefulLife: decimal("useful_life", { precision: 4, scale: 1 }).notNull(), // years
  description: text("description"),
  applicableYears: text("applicable_years"), // e.g., "2024-present"
  status: text("status").notNull().default("active"), // active, inactive, deprecated
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tax Calculator schemas
export const insertTaxBracketSchema = createInsertSchema(taxBrackets).omit({
  id: true,
  createdAt: true,
});

export const insertDepreciationRuleSchema = createInsertSchema(depreciationRules).omit({
  id: true,
  createdAt: true,
});

// Tax Calculator types
export type TaxBracket = typeof taxBrackets.$inferSelect;
export type InsertTaxBracket = z.infer<typeof insertTaxBracketSchema>;

export type DepreciationRule = typeof depreciationRules.$inferSelect;
export type InsertDepreciationRule = z.infer<typeof insertDepreciationRuleSchema>;

// Tax Calculator response types
export type TaxBracketsResponse = TaxBracket[];
export type DepreciationRulesResponse = DepreciationRule[];

// System Settings Storage
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
  settingType: text("setting_type").notNull().default("string"), // string, number, boolean, json
  description: text("description"),
  isSecure: boolean("is_secure").default(false).notNull(),
  updatedBy: integer("updated_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;

// AI Configuration Table
export const aiConfiguration = pgTable("ai_configuration", {
  id: serial("id").primaryKey(),
  openaiApiKey: text("openai_api_key"),
  aiModel: text("ai_model").default('gpt-4o'),
  aiTemperature: decimal("ai_temperature", { precision: 3, scale: 2 }).default('0.7'),
  recommendationStrategy: text("recommendation_strategy").default('target_markets'),
  personalizationEnabled: boolean("personalization_enabled").default(true),
  emailNotifications: boolean("email_notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Market Priorities Table
export const marketPriorities = pgTable("market_priorities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  priority: integer("priority").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  hasActiveProperties: boolean("has_active_properties").default(false),
  targetInvestorTypes: text("target_investor_types"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// AI Performance Metrics Table
export const aiPerformanceMetrics = pgTable("ai_performance_metrics", {
  id: serial("id").primaryKey(),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
  matchQuality: decimal("match_quality", { precision: 5, scale: 2 }),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }),
  matchThreshold: integer("match_threshold").default(85),
  maxRecommendations: integer("max_recommendations").default(5),
  totalRecommendations: integer("total_recommendations").default(0),
  successfulMatches: integer("successful_matches").default(0),
  recordedAt: timestamp("recorded_at").defaultNow()
});

// AI Activity Log Table
export const aiActivityLog = pgTable("ai_activity_log", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  tab: text("tab"),
  timestamp: timestamp("timestamp").defaultNow(),
  level: text("level").default('info'), // info, warning, error
  metadata: text("metadata") // JSON string for additional data
});

// AI Settings Insert Schemas
export const insertAIConfigurationSchema = createInsertSchema(aiConfiguration).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketPrioritySchema = createInsertSchema(marketPriorities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAIPerformanceMetricSchema = createInsertSchema(aiPerformanceMetrics).omit({
  id: true,
  recordedAt: true,
});

export const insertAIActivityLogEntrySchema = createInsertSchema(aiActivityLog).omit({
  id: true,
  timestamp: true,
});

// AI Settings Type exports
export type AIConfiguration = typeof aiConfiguration.$inferSelect;
export type InsertAIConfiguration = z.infer<typeof insertAIConfigurationSchema>;
export type MarketPriority = typeof marketPriorities.$inferSelect;
export type InsertMarketPriority = z.infer<typeof insertMarketPrioritySchema>;
export type AIPerformanceMetric = typeof aiPerformanceMetrics.$inferSelect;
export type InsertAIPerformanceMetric = z.infer<typeof insertAIPerformanceMetricSchema>;
export type AIActivityLogEntry = typeof aiActivityLog.$inferSelect;
export type InsertAIActivityLogEntry = z.infer<typeof insertAIActivityLogEntrySchema>;

// Project Notification System Tables
export const userNotificationPreferences = pgTable("user_notification_preferences", {
  id: serial("id").primaryKey(),
  userEmail: text("user_email").notNull().unique(),
  userName: text("user_name"),
  enableRestorePointNotifications: boolean("enable_restore_point_notifications").default(true).notNull(),
  enableFeatureCompleteNotifications: boolean("enable_feature_complete_notifications").default(true).notNull(),
  enableMaintenanceNotifications: boolean("enable_maintenance_notifications").default(true).notNull(),
  enableWeeklyUpdates: boolean("enable_weekly_updates").default(false).notNull(),
  enableCustomMilestones: boolean("enable_custom_milestones").default(false).notNull(),
  notificationFrequency: text("notification_frequency").default("immediate").notNull(), // 'immediate', 'daily', 'weekly'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectNotifications = pgTable("project_notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'restore_point', 'feature_complete', 'maintenance', 'weekly_update', 'custom_milestone'
  title: text("title").notNull(),
  message: text("message").notNull(),
  htmlContent: text("html_content"),
  priority: text("priority").default("normal").notNull(), // 'low', 'normal', 'high', 'urgent'
  status: text("status").default("pending").notNull(), // 'pending', 'sent', 'failed', 'cancelled'
  targetEmail: text("target_email"),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0).notNull(),
  maxRetries: integer("max_retries").default(3).notNull(),
});

export const notificationQueue = pgTable("notification_queue", {
  id: serial("id").primaryKey(),
  notificationId: integer("notification_id").references(() => projectNotifications.id).notNull(),
  status: text("status").default("queued").notNull(), // 'queued', 'processing', 'sent', 'failed'
  scheduledFor: timestamp("scheduled_for").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0).notNull(),
});

export const projectRestorePoints = pgTable("project_restore_points", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  version: text("version"),
  featuresCompleted: text("features_completed"), // JSON array of completed features
  systemStatus: text("system_status").default("operational").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: text("created_by").default("system").notNull(),
  notificationSent: boolean("notification_sent").default(false).notNull(),
  metadata: text("metadata"), // JSON string for additional restore point data
});

// Insert schemas for notification system
export const insertUserNotificationPreferencesSchema = createInsertSchema(userNotificationPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectNotificationSchema = createInsertSchema(projectNotifications).omit({
  id: true,
  createdAt: true,
  sentAt: true,
});

export const insertNotificationQueueSchema = createInsertSchema(notificationQueue).omit({
  id: true,
  processedAt: true,
});

export const insertProjectRestorePointSchema = createInsertSchema(projectRestorePoints).omit({
  id: true,
  createdAt: true,
});

// Type exports for notification system
export type UserNotificationPreferences = typeof userNotificationPreferences.$inferSelect;
export type InsertUserNotificationPreferences = z.infer<typeof insertUserNotificationPreferencesSchema>;

export type ProjectNotification = typeof projectNotifications.$inferSelect;
export type InsertProjectNotification = z.infer<typeof insertProjectNotificationSchema>;

export type NotificationQueue = typeof notificationQueue.$inferSelect;
export type InsertNotificationQueue = z.infer<typeof insertNotificationQueueSchema>;

export type ProjectRestorePoint = typeof projectRestorePoints.$inferSelect;
export type InsertProjectRestorePoint = z.infer<typeof insertProjectRestorePointSchema>;

// Notification response types
export type NotificationPreferencesResponse = UserNotificationPreferences;
export type ProjectNotificationsResponse = ProjectNotification[];
export type RestorePointsResponse = ProjectRestorePoint[];
