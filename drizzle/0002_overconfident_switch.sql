CREATE TABLE `operations_candidates` (
	`id` varchar(64) NOT NULL,
	`pilotId` varchar(64) NOT NULL,
	`sourceRegistryId` varchar(128),
	`trustSlug` varchar(255),
	`sourceUrl` varchar(2048) NOT NULL,
	`changeType` enum('source_changed','source_inaccessible','payment_notice','financial_report','claims_procedure','trust_status','court_development','article_lead','controlled_test') NOT NULL,
	`severity` enum('routine','material','urgent') NOT NULL DEFAULT 'routine',
	`status` enum('detected','under_review','verified','released','rejected','blocked') NOT NULL DEFAULT 'detected',
	`detectedAt` timestamp NOT NULL DEFAULT (now()),
	`observedAt` timestamp,
	`evidence` text NOT NULL,
	`assignedOwner` varchar(255) NOT NULL,
	`nextAction` text NOT NULL,
	`disposition` text,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operations_candidates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operations_pilots` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('active','completed','paused') NOT NULL DEFAULT 'active',
	`startDate` varchar(10) NOT NULL,
	`endDate` varchar(10) NOT NULL,
	`timezone` varchar(64) NOT NULL,
	`scope` text NOT NULL,
	`publicationAuthority` text NOT NULL,
	`researchOwner` varchar(255) NOT NULL,
	`researchBackupOwner` varchar(255) NOT NULL,
	`editorialOwner` varchar(255) NOT NULL,
	`editorialBackupOwner` varchar(255) NOT NULL,
	`releaseOwner` varchar(255) NOT NULL,
	`releaseBackupOwner` varchar(255) NOT NULL,
	`articleReviewPolicy` text NOT NULL,
	`researchLimits` text NOT NULL,
	`usageLimits` text NOT NULL,
	`digestDestination` varchar(64) NOT NULL,
	`noChargePacer` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operations_pilots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operations_releases` (
	`id` varchar(64) NOT NULL,
	`pilotId` varchar(64) NOT NULL,
	`candidateId` varchar(64),
	`releaseType` enum('tracker_update','news_brief','analysis','correction','no_publication') NOT NULL,
	`status` enum('prepared','published','blocked','rolled_back') NOT NULL,
	`sourceCutoffAt` timestamp,
	`evidenceSummary` text NOT NULL,
	`articleSpecificReviewJson` text,
	`technicalVerification` text NOT NULL,
	`publishedVersion` varchar(128),
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operations_releases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operations_runs` (
	`id` varchar(64) NOT NULL,
	`pilotId` varchar(64) NOT NULL,
	`runType` enum('daily_detection','weekly_coverage','weekly_digest','monthly_research_prep','quarterly_audit_prep','controlled_test') NOT NULL,
	`scheduledFor` timestamp,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`status` enum('running','success','partial','failed','skipped') NOT NULL DEFAULT 'running',
	`sourceCount` int NOT NULL DEFAULT 0,
	`checkedCount` int NOT NULL DEFAULT 0,
	`changedCount` int NOT NULL DEFAULT 0,
	`failedCount` int NOT NULL DEFAULT 0,
	`candidateCount` int NOT NULL DEFAULT 0,
	`resultSummary` text NOT NULL,
	`resultJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `operations_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `source_registry` (
	`id` varchar(128) NOT NULL,
	`pilotId` varchar(64) NOT NULL,
	`trustSlug` varchar(255),
	`trustName` varchar(255),
	`sourceUrl` varchar(2048) NOT NULL,
	`sourceClass` enum('official_trust','administrator','case_agent','court','government','primary_document') NOT NULL,
	`factClasses` text NOT NULL,
	`checkCadence` enum('daily','weekly') NOT NULL DEFAULT 'weekly',
	`priority` int NOT NULL DEFAULT 2,
	`retrievalNotes` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastSuccessfulCheckAt` timestamp,
	`lastCheckedAt` timestamp,
	`nextCheckAt` timestamp,
	`lastStatusCode` int,
	`contentHash` varchar(64),
	`failureCount` int NOT NULL DEFAULT 0,
	`lastError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `source_registry_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `operations_candidates_pilot_status_idx` ON `operations_candidates` (`pilotId`,`status`);--> statement-breakpoint
CREATE INDEX `operations_candidates_source_idx` ON `operations_candidates` (`sourceRegistryId`,`detectedAt`);--> statement-breakpoint
CREATE INDEX `operations_releases_pilot_status_idx` ON `operations_releases` (`pilotId`,`status`);--> statement-breakpoint
CREATE INDEX `operations_releases_candidate_idx` ON `operations_releases` (`candidateId`);--> statement-breakpoint
CREATE INDEX `operations_runs_pilot_type_started_idx` ON `operations_runs` (`pilotId`,`runType`,`startedAt`);--> statement-breakpoint
CREATE INDEX `source_registry_pilot_next_idx` ON `source_registry` (`pilotId`,`nextCheckAt`);--> statement-breakpoint
CREATE INDEX `source_registry_pilot_trust_idx` ON `source_registry` (`pilotId`,`trustSlug`);