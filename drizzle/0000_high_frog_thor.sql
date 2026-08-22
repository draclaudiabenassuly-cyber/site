CREATE TABLE `agenda_events` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`day` text NOT NULL,
	`month` text NOT NULL,
	`title` text NOT NULL,
	`location` text NOT NULL,
	`detail` text NOT NULL,
	`tone` text NOT NULL,
	`sort_order` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cms_content` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `news_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`read_time` text NOT NULL,
	`image` text NOT NULL,
	`published_at` text NOT NULL,
	`sort_order` integer NOT NULL,
	`updated_at` integer NOT NULL
);
