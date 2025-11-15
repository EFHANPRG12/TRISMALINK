-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Shortlink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "customAlias" TEXT,
    "description" TEXT,
    "tags" TEXT NOT NULL DEFAULT '',
    "expiresAt" DATETIME,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shortlink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LinkList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "profileImageUrl" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "backgroundType" TEXT NOT NULL DEFAULT 'solid',
    "backgroundValue" TEXT,
    "buttonStyle" TEXT NOT NULL DEFAULT 'rounded',
    "buttonColor" TEXT NOT NULL DEFAULT '#000000',
    "textColor" TEXT NOT NULL DEFAULT '#ffffff',
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "layout" TEXT NOT NULL DEFAULT 'center',
    "customCss" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LinkList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ListItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "LinkList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClickAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortlinkId" TEXT,
    "listItemId" TEXT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "referrer" TEXT,
    "country" TEXT,
    "city" TEXT,
    "clickedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClickAnalytics_shortlinkId_fkey" FOREIGN KEY ("shortlinkId") REFERENCES "Shortlink" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClickAnalytics_listItemId_fkey" FOREIGN KEY ("listItemId") REFERENCES "ListItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shortlink_shortCode_key" ON "Shortlink"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Shortlink_customAlias_key" ON "Shortlink"("customAlias");

-- CreateIndex
CREATE INDEX "Shortlink_shortCode_idx" ON "Shortlink"("shortCode");

-- CreateIndex
CREATE INDEX "Shortlink_customAlias_idx" ON "Shortlink"("customAlias");

-- CreateIndex
CREATE INDEX "Shortlink_userId_idx" ON "Shortlink"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkList_slug_key" ON "LinkList"("slug");

-- CreateIndex
CREATE INDEX "LinkList_slug_idx" ON "LinkList"("slug");

-- CreateIndex
CREATE INDEX "LinkList_userId_idx" ON "LinkList"("userId");

-- CreateIndex
CREATE INDEX "ListItem_listId_idx" ON "ListItem"("listId");

-- CreateIndex
CREATE INDEX "ListItem_order_idx" ON "ListItem"("order");

-- CreateIndex
CREATE INDEX "ClickAnalytics_shortlinkId_idx" ON "ClickAnalytics"("shortlinkId");

-- CreateIndex
CREATE INDEX "ClickAnalytics_listItemId_idx" ON "ClickAnalytics"("listItemId");

-- CreateIndex
CREATE INDEX "ClickAnalytics_clickedAt_idx" ON "ClickAnalytics"("clickedAt");
