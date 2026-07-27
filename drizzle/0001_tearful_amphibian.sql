CREATE TABLE `aggregate_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`remainingLow` bigint NOT NULL,
	`remainingHigh` bigint NOT NULL,
	`remainingLabel` varchar(50) NOT NULL,
	`paidOut` bigint NOT NULL,
	`paidOutLabel` varchar(50) NOT NULL,
	`totalActiveTrusts` int NOT NULL,
	`methodology` text,
	`asOfNote` text,
	`isCurrent` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aggregate_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`summary` text,
	`url` varchar(1000),
	`source` varchar(255),
	`publishedAt` timestamp,
	`trustId` varchar(64),
	`category` enum('payment_change','annual_report','court_filing','research','general') DEFAULT 'general',
	`isVisible` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `news_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trustId` varchar(64) NOT NULL,
	`pct` float NOT NULL,
	`effective` varchar(20) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trusts` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`shortName` varchar(100),
	`company` varchar(255),
	`established` int,
	`administrator` varchar(100),
	`court` varchar(100),
	`docket` varchar(100),
	`website` varchar(255),
	`paymentPct` float,
	`paymentPctEffective` varchar(20),
	`netAssets` bigint,
	`netAssetsAsOf` varchar(20),
	`netAssetsSource` enum('a','b','c'),
	`netAssetsCitation` text,
	`cumulativePaid` bigint,
	`cumulativeClaims` int,
	`reportingFrequency` enum('quarterly','annual','unknown') DEFAULT 'annual',
	`status` enum('active','inactive','closed') DEFAULT 'active',
	`direction` enum('up','down','stable') DEFAULT 'stable',
	`notes` text,
	`isStale` boolean DEFAULT false,
	`lastChecked` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trusts_id` PRIMARY KEY(`id`)
);
