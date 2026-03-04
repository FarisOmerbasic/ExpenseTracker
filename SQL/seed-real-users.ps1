# Seed real users with expenses, categories, budgets, accounts, payment methods
# Uses the actual API endpoints to ensure proper password hashing

$baseUrl = "http://localhost:8081/api"

# 12 Users with realistic names and varied currencies
$users = @(
    @{ name = "Emma Thompson"; email = "emma.thompson@email.com"; password = "Emma2026!"; currency = "USD" },
    @{ name = "Liam Johnson"; email = "liam.johnson@email.com"; password = "Liam2026!"; currency = "USD" },
    @{ name = "Olivia Martinez"; email = "olivia.martinez@email.com"; password = "Olivia2026!"; currency = "EUR" },
    @{ name = "Noah Williams"; email = "noah.williams@email.com"; password = "Noah2026!"; currency = "USD" },
    @{ name = "Ava Brown"; email = "ava.brown@email.com"; password = "Ava2026!"; currency = "GBP" },
    @{ name = "Elijah Davis"; email = "elijah.davis@email.com"; password = "Elijah2026!"; currency = "USD" },
    @{ name = "Sophia Garcia"; email = "sophia.garcia@email.com"; password = "Sophia2026!"; currency = "EUR" },
    @{ name = "James Wilson"; email = "james.wilson@email.com"; password = "James2026!"; currency = "USD" },
    @{ name = "Isabella Anderson"; email = "isabella.anderson@email.com"; password = "Isabella2026!"; currency = "CAD" },
    @{ name = "Benjamin Taylor"; email = "benjamin.taylor@email.com"; password = "Benjamin2026!"; currency = "USD" },
    @{ name = "Mia Thomas"; email = "mia.thomas@email.com"; password = "Mia2026!"; currency = "AUD" },
    @{ name = "Lucas Moore"; email = "lucas.moore@email.com"; password = "Lucas2026!"; currency = "USD" }
)

# Category templates (each user gets a subset)
$categoryTemplates = @(
    "Groceries", "Dining Out", "Transportation", "Utilities", "Entertainment",
    "Healthcare", "Shopping", "Travel", "Subscriptions", "Education",
    "Fitness", "Personal Care", "Home & Garden", "Insurance", "Gifts"
)

# Account types
$accountTypes = @("Checking", "Savings", "Cash", "Credit Card", "Investment")

# Payment method types
$pmTypes = @(
    @{ name = "Visa Debit"; type = "Card" },
    @{ name = "Mastercard"; type = "Card" },
    @{ name = "Cash"; type = "Cash" },
    @{ name = "Bank Transfer"; type = "BankTransfer" },
    @{ name = "PayPal"; type = "Digital" },
    @{ name = "Apple Pay"; type = "Digital" }
)

# Expense descriptions by category
$expenseDescriptions = @{
    "Groceries" = @("Weekly groceries", "Farmers market", "Costco run", "Trader Joe's", "Whole Foods")
    "Dining Out" = @("Lunch with colleagues", "Dinner date", "Coffee shop", "Fast food", "Brunch")
    "Transportation" = @("Gas", "Uber ride", "Metro pass", "Car wash", "Parking")
    "Utilities" = @("Electric bill", "Water bill", "Internet", "Phone bill", "Gas bill")
    "Entertainment" = @("Movie tickets", "Concert", "Streaming service", "Video games", "Books")
    "Healthcare" = @("Doctor visit", "Pharmacy", "Dentist", "Eye exam", "Vitamins")
    "Shopping" = @("Clothing", "Electronics", "Home goods", "Online shopping", "Gifts")
    "Travel" = @("Flight tickets", "Hotel", "Airbnb", "Car rental", "Travel insurance")
    "Subscriptions" = @("Netflix", "Spotify", "Gym membership", "News subscription", "Cloud storage")
    "Education" = @("Online course", "Books", "Certification", "Workshop", "Tutorial")
    "Fitness" = @("Gym", "Yoga class", "Sports equipment", "Protein supplements", "Running shoes")
    "Personal Care" = @("Haircut", "Skincare", "Spa", "Toiletries", "Cosmetics")
    "Home & Garden" = @("Plants", "Cleaning supplies", "Furniture", "Tools", "Decor")
    "Insurance" = @("Car insurance", "Health insurance", "Life insurance", "Renter's insurance")
    "Gifts" = @("Birthday gift", "Holiday presents", "Wedding gift", "Baby shower", "Anniversary")
}

function Get-RandomAmount($min, $max) {
    return [math]::Round((Get-Random -Minimum $min -Maximum $max), 2)
}

function Get-RandomDate($monthsBack) {
    $daysBack = Get-Random -Minimum 0 -Maximum ($monthsBack * 30)
    return (Get-Date).AddDays(-$daysBack).ToString("yyyy-MM-dd")
}

Write-Host "Starting to create users and data..." -ForegroundColor Cyan

foreach ($user in $users) {
    Write-Host "`nCreating user: $($user.name)" -ForegroundColor Yellow
    
    # Register user
    $registerBody = @{
        name = $user.name
        email = $user.email
        password = $user.password
        currencyPreference = $user.currency
    } | ConvertTo-Json
    
    try {
        $authResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
        $token = $authResponse.accessToken
        $userId = $authResponse.user.userId
        Write-Host "  Registered with ID: $userId" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to register: $_" -ForegroundColor Red
        continue
    }
    
    $headers = @{ Authorization = "Bearer $token" }
    
    # Create 4-6 categories per user
    $numCategories = Get-Random -Minimum 4 -Maximum 7
    $userCategories = $categoryTemplates | Get-Random -Count $numCategories
    $categoryIds = @{}
    $sortOrder = 1
    
    foreach ($cat in $userCategories) {
        $catBody = @{ userId = $userId; name = $cat; sortOrder = $sortOrder } | ConvertTo-Json
        try {
            $catResp = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Post -Body $catBody -ContentType "application/json" -Headers $headers
            $categoryIds[$cat] = $catResp.categoryId
            $sortOrder++
        } catch {
            Write-Host "  Failed to create category $cat" -ForegroundColor Red
        }
    }
    Write-Host "  Created $($categoryIds.Count) categories"
    
    # Create 2-3 accounts per user
    $numAccounts = Get-Random -Minimum 2 -Maximum 4
    $userAccountTypes = $accountTypes | Get-Random -Count $numAccounts
    $accountIds = @()
    
    foreach ($accType in $userAccountTypes) {
        $initialBalance = Get-RandomAmount 1000 15000
        $currentBalance = Get-RandomAmount ($initialBalance * 0.5) ($initialBalance * 1.2)
        $accBody = @{
            userId = $userId
            name = "$accType Account"
            type = $accType
            initialBalance = $initialBalance
            currentBalance = $currentBalance
        } | ConvertTo-Json
        try {
            $accResp = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method Post -Body $accBody -ContentType "application/json" -Headers $headers
            $accountIds += $accResp.accountId
        } catch {
            Write-Host "  Failed to create account $accType" -ForegroundColor Red
        }
    }
    Write-Host "  Created $($accountIds.Count) accounts"
    
    # Create 2-4 payment methods per user
    $numPm = Get-Random -Minimum 2 -Maximum 5
    $userPms = $pmTypes | Get-Random -Count $numPm
    $pmIds = @()
    
    foreach ($pm in $userPms) {
        $pmBody = @{ userId = $userId; name = $pm.name; type = $pm.type } | ConvertTo-Json
        try {
            $pmResp = Invoke-RestMethod -Uri "$baseUrl/paymentmethods" -Method Post -Body $pmBody -ContentType "application/json" -Headers $headers
            $pmIds += $pmResp.paymentMethodId
        } catch {
            Write-Host "  Failed to create payment method $($pm.name): $_" -ForegroundColor Red
        }
    }
    Write-Host "  Created $($pmIds.Count) payment methods"
    
    # Create 1-3 budgets per user
    $numBudgets = Get-Random -Minimum 1 -Maximum 4
    $budgetCategories = $categoryIds.Keys | Get-Random -Count ([Math]::Min($numBudgets, $categoryIds.Count))
    
    foreach ($budgetCat in $budgetCategories) {
        $budgetAmount = Get-RandomAmount 200 800
        $budgetBody = @{
            userId = $userId
            categoryId = $categoryIds[$budgetCat]
            name = "$budgetCat Budget"
            amount = $budgetAmount
        } | ConvertTo-Json
        try {
            Invoke-RestMethod -Uri "$baseUrl/budgets" -Method Post -Body $budgetBody -ContentType "application/json" -Headers $headers | Out-Null
        } catch {
            Write-Host "  Failed to create budget for $budgetCat" -ForegroundColor Red
        }
    }
    Write-Host "  Created $($budgetCategories.Count) budgets"
    
    # Create 15-35 expenses per user (spread over 6 months)
    $numExpenses = Get-Random -Minimum 15 -Maximum 36
    $expenseCount = 0
    
    for ($i = 0; $i -lt $numExpenses; $i++) {
        $cat = $categoryIds.Keys | Get-Random
        $catId = $categoryIds[$cat]
        $pmId = $pmIds | Get-Random
        $accId = if ((Get-Random -Minimum 0 -Maximum 10) -gt 2) { $accountIds | Get-Random } else { $null }
        
        $descriptions = $expenseDescriptions[$cat]
        if (-not $descriptions) { $descriptions = @("Expense") }
        $desc = $descriptions | Get-Random
        
        $amount = switch ($cat) {
            "Groceries" { Get-RandomAmount 30 200 }
            "Dining Out" { Get-RandomAmount 15 120 }
            "Transportation" { Get-RandomAmount 20 150 }
            "Utilities" { Get-RandomAmount 50 250 }
            "Entertainment" { Get-RandomAmount 10 100 }
            "Healthcare" { Get-RandomAmount 25 300 }
            "Shopping" { Get-RandomAmount 30 400 }
            "Travel" { Get-RandomAmount 100 1500 }
            "Subscriptions" { Get-RandomAmount 10 50 }
            "Education" { Get-RandomAmount 20 500 }
            "Fitness" { Get-RandomAmount 20 100 }
            "Personal Care" { Get-RandomAmount 20 150 }
            "Home & Garden" { Get-RandomAmount 25 300 }
            "Insurance" { Get-RandomAmount 100 400 }
            "Gifts" { Get-RandomAmount 30 200 }
            default { Get-RandomAmount 20 150 }
        }
        
        $expenseBody = @{
            userId = $userId
            categoryId = $catId
            paymentMethodId = $pmId
            amount = $amount
            date = Get-RandomDate 6
            description = $desc
        }
        if ($accId) { $expenseBody.accountId = $accId }
        
        try {
            Invoke-RestMethod -Uri "$baseUrl/expenses" -Method Post -Body ($expenseBody | ConvertTo-Json) -ContentType "application/json" -Headers $headers | Out-Null
            $expenseCount++
        } catch {
            # Silently continue
        }
    }
    Write-Host "  Created $expenseCount expenses"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Seeding complete! Checking public stats..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verify the data
$stats = Invoke-RestMethod -Uri "$baseUrl/stats/public" -Method Get
Write-Host "LANDING PAGE STATS:" -ForegroundColor Green
Write-Host "  Total Spent: `$$($stats.totalSpent)"
Write-Host "  This Month: `$$($stats.thisMonth)"
Write-Host "  Month Change: $($stats.monthChange)%"
Write-Host "  Transactions This Month: $($stats.transactionsThisMonth)"
Write-Host "  Active Categories: $($stats.activeCategories)"
Write-Host "  Total Balance: `$$($stats.totalBalance)"
Write-Host "`nCategories:"
$stats.categories | ForEach-Object { Write-Host "  - $($_.name): `$$($_.amount)" }
Write-Host "`nMonthly Trend:"
$stats.monthlyTrend | ForEach-Object { Write-Host "  - $($_.label): `$$($_.amount)" }
