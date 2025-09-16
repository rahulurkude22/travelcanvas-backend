import { relations } from 'drizzle-orm/relations';
import {
  userProfiles,
  itineraries,
  designTemplates,
  userFavorites,
  collaborations,
  assetLibrary,
  templateReviews,
  contentBlocks,
  adminActivityLogs,
  contentReports,
  userSubscriptions,
  subscriptionPlans,
  purchases,
  creatorEarnings,
  userSessions,
  destinations,
  itineraryDays,
  itineraryItems,
  activityTypes,
  reviews,
  userBucketLists,
  quoteRequests,
  quoteResponses,
} from './schema';

export const itinerariesRelations = relations(itineraries, ({ one, many }) => ({
  userProfile: one(userProfiles, {
    fields: [itineraries.userId],
    references: [userProfiles.id],
  }),
  userFavorites: many(userFavorites),
  collaborations: many(collaborations),
  itineraryDays: many(itineraryDays),
  userBucketLists: many(userBucketLists),
  quoteRequests: many(quoteRequests),
}));

export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  itineraries: many(itineraries),
  designTemplates: many(designTemplates),
  userFavorites: many(userFavorites),
  collaborations_userId: many(collaborations, {
    relationName: 'collaborations_userId_userProfiles_id',
  }),
  collaborations_invitedBy: many(collaborations, {
    relationName: 'collaborations_invitedBy_userProfiles_id',
  }),
  assetLibraries: many(assetLibrary),
  templateReviews: many(templateReviews),
  contentBlocks: many(contentBlocks),
  adminActivityLogs: many(adminActivityLogs),
  contentReports_reporterUserId: many(contentReports, {
    relationName: 'contentReports_reporterUserId_userProfiles_id',
  }),
  contentReports_resolvedBy: many(contentReports, {
    relationName: 'contentReports_resolvedBy_userProfiles_id',
  }),
  userSubscriptions: many(userSubscriptions),
  purchases_buyerUserId: many(purchases, {
    relationName: 'purchases_buyerUserId_userProfiles_id',
  }),
  purchases_sellerUserId: many(purchases, {
    relationName: 'purchases_sellerUserId_userProfiles_id',
  }),
  creatorEarnings: many(creatorEarnings),
  userSessions: many(userSessions),
  destinations: many(destinations),
  reviews: many(reviews),
  userBucketLists: many(userBucketLists),
  quoteRequests_userId: many(quoteRequests, {
    relationName: 'quoteRequests_userId_userProfiles_id',
  }),
  quoteRequests_assignedTo: many(quoteRequests, {
    relationName: 'quoteRequests_assignedTo_userProfiles_id',
  }),
  quoteResponses: many(quoteResponses),
}));

export const designTemplatesRelations = relations(
  designTemplates,
  ({ one, many }) => ({
    userProfile: one(userProfiles, {
      fields: [designTemplates.userId],
      references: [userProfiles.id],
    }),
    templateReviews: many(templateReviews),
  }),
);

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [userFavorites.userId],
    references: [userProfiles.id],
  }),
  itinerary: one(itineraries, {
    fields: [userFavorites.itineraryId],
    references: [itineraries.id],
  }),
}));

export const collaborationsRelations = relations(collaborations, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [collaborations.itineraryId],
    references: [itineraries.id],
  }),
  userProfile_userId: one(userProfiles, {
    fields: [collaborations.userId],
    references: [userProfiles.id],
    relationName: 'collaborations_userId_userProfiles_id',
  }),
  userProfile_invitedBy: one(userProfiles, {
    fields: [collaborations.invitedBy],
    references: [userProfiles.id],
    relationName: 'collaborations_invitedBy_userProfiles_id',
  }),
}));

export const assetLibraryRelations = relations(assetLibrary, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [assetLibrary.userId],
    references: [userProfiles.id],
  }),
}));

export const templateReviewsRelations = relations(
  templateReviews,
  ({ one }) => ({
    designTemplate: one(designTemplates, {
      fields: [templateReviews.templateId],
      references: [designTemplates.id],
    }),
    userProfile: one(userProfiles, {
      fields: [templateReviews.userId],
      references: [userProfiles.id],
    }),
  }),
);

export const contentBlocksRelations = relations(contentBlocks, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [contentBlocks.userId],
    references: [userProfiles.id],
  }),
}));

export const adminActivityLogsRelations = relations(
  adminActivityLogs,
  ({ one }) => ({
    userProfile: one(userProfiles, {
      fields: [adminActivityLogs.adminUserId],
      references: [userProfiles.id],
    }),
  }),
);

export const contentReportsRelations = relations(contentReports, ({ one }) => ({
  userProfile_reporterUserId: one(userProfiles, {
    fields: [contentReports.reporterUserId],
    references: [userProfiles.id],
    relationName: 'contentReports_reporterUserId_userProfiles_id',
  }),
  userProfile_resolvedBy: one(userProfiles, {
    fields: [contentReports.resolvedBy],
    references: [userProfiles.id],
    relationName: 'contentReports_resolvedBy_userProfiles_id',
  }),
}));

export const userSubscriptionsRelations = relations(
  userSubscriptions,
  ({ one }) => ({
    userProfile: one(userProfiles, {
      fields: [userSubscriptions.userId],
      references: [userProfiles.id],
    }),
    subscriptionPlan: one(subscriptionPlans, {
      fields: [userSubscriptions.planId],
      references: [subscriptionPlans.id],
    }),
  }),
);

export const subscriptionPlansRelations = relations(
  subscriptionPlans,
  ({ many }) => ({
    userSubscriptions: many(userSubscriptions),
  }),
);

export const purchasesRelations = relations(purchases, ({ one }) => ({
  userProfile_buyerUserId: one(userProfiles, {
    fields: [purchases.buyerUserId],
    references: [userProfiles.id],
    relationName: 'purchases_buyerUserId_userProfiles_id',
  }),
  userProfile_sellerUserId: one(userProfiles, {
    fields: [purchases.sellerUserId],
    references: [userProfiles.id],
    relationName: 'purchases_sellerUserId_userProfiles_id',
  }),
}));

export const creatorEarningsRelations = relations(
  creatorEarnings,
  ({ one }) => ({
    userProfile: one(userProfiles, {
      fields: [creatorEarnings.userId],
      references: [userProfiles.id],
    }),
  }),
);

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [userSessions.userId],
    references: [userProfiles.id],
  }),
}));

export const destinationsRelations = relations(
  destinations,
  ({ one, many }) => ({
    userProfile: one(userProfiles, {
      fields: [destinations.createdBy],
      references: [userProfiles.id],
    }),
    itineraryItems: many(itineraryItems),
    itineraryDays: many(itineraryDays),
  }),
);

export const itineraryItemsRelations = relations(itineraryItems, ({ one }) => ({
  itineraryDay: one(itineraryDays, {
    fields: [itineraryItems.itineraryDayId],
    references: [itineraryDays.id],
  }),
  activityType: one(activityTypes, {
    fields: [itineraryItems.activityTypeId],
    references: [activityTypes.id],
  }),
  destination: one(destinations, {
    fields: [itineraryItems.destinationId],
    references: [destinations.id],
  }),
}));

export const itineraryDaysRelations = relations(
  itineraryDays,
  ({ one, many }) => ({
    itineraryItems: many(itineraryItems),
    itinerary: one(itineraries, {
      fields: [itineraryDays.itineraryId],
      references: [itineraries.id],
    }),
    destination: one(destinations, {
      fields: [itineraryDays.destinationId],
      references: [destinations.id],
    }),
  }),
);

export const activityTypesRelations = relations(activityTypes, ({ many }) => ({
  itineraryItems: many(itineraryItems),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [reviews.userId],
    references: [userProfiles.id],
  }),
}));

export const userBucketListsRelations = relations(
  userBucketLists,
  ({ one }) => ({
    userProfile: one(userProfiles, {
      fields: [userBucketLists.userId],
      references: [userProfiles.id],
    }),
    itinerary: one(itineraries, {
      fields: [userBucketLists.itineraryId],
      references: [itineraries.id],
    }),
  }),
);

export const quoteRequestsRelations = relations(
  quoteRequests,
  ({ one, many }) => ({
    userProfile_userId: one(userProfiles, {
      fields: [quoteRequests.userId],
      references: [userProfiles.id],
      relationName: 'quoteRequests_userId_userProfiles_id',
    }),
    itinerary: one(itineraries, {
      fields: [quoteRequests.itineraryId],
      references: [itineraries.id],
    }),
    userProfile_assignedTo: one(userProfiles, {
      fields: [quoteRequests.assignedTo],
      references: [userProfiles.id],
      relationName: 'quoteRequests_assignedTo_userProfiles_id',
    }),
    quoteResponses: many(quoteResponses),
  }),
);

export const quoteResponsesRelations = relations(quoteResponses, ({ one }) => ({
  quoteRequest: one(quoteRequests, {
    fields: [quoteResponses.quoteRequestId],
    references: [quoteRequests.id],
  }),
  userProfile: one(userProfiles, {
    fields: [quoteResponses.responderId],
    references: [userProfiles.id],
  }),
}));
