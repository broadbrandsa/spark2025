# SPARK Report Data Inputs (Stub)

This project will ingest local CSV files at build time in a later phase.
For now, `loadReportData()` in `src/lib/data.ts` returns mock structured data.

## Reporting Window
- Jan 2025 to Dec 2025, plus Jan 2026

## Planned CSV Files

### 1) Meta Ads (`meta_monthly.csv`)
Monthly performance, overall and by school where available.

```csv
date,school_slug,campaign,ad_set,spend,clicks,impressions,leads,ctr,cpc,cpl
2025-01,meyersdal,Campaign A,Ad Set 1,12500,2100,94000,62,2.23,5.95,201.61
```

### 2) Google Ads (`google_monthly.csv`)
Monthly Google paid performance with campaign-level support.

```csv
date,school_slug,campaign,spend,clicks,impressions,leads,ctr,cpc,cpl
2025-01,meyersdal,Search Brand,8700,1450,51000,39,2.84,6.00,223.08
```

### 3) GA4 Organic (`ga4_organic_monthly.csv`)
Organic website metrics and leads by month.

```csv
date,school_slug,sessions,users,organic_leads,conversion_rate
2025-01,meyersdal,9500,7400,28,0.29
```

### 4) GA4 Geo (`ga4_geo.csv`)
Geo-level organic performance rows for mini tables.

```csv
date,school_slug,region,sessions,organic_leads,conversion_rate
2025-01,meyersdal,Gauteng,4200,14,0.33
```

### 5) Search Console (`search_console_monthly.csv`)
Search visibility and query-level outputs.

```csv
date,school_slug,query,clicks,impressions,average_position
2025-01,meyersdal,spark schools admissions,840,16200,2.4
```

## Notes
- `school_slug` should map to `/schools/[school]` route params.
- Currency values are in ZAR.
- YoY by month will be introduced once prior-year source files are added.
