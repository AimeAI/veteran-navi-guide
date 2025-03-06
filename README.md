
# Veteran Career Compass

A platform to help military veterans find employment opportunities and transition to civilian careers.

## Job Search API Integration

The job search functionality now uses a Supabase Edge Function to proxy requests to job search APIs. This helps avoid CORS issues and provides a more reliable experience.

### Deploying the Job Search Proxy Function

To deploy the job search proxy function:

1. Make sure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Deploy the function:
   ```bash
   supabase functions deploy job-search-proxy --no-verify-jwt
   ```

### Accessing the Job Search API

The job search API can be accessed at:
```
https://[YOUR_SUPABASE_URL]/functions/v1/job-search-proxy
```

Parameters:
- `keywords`: Job search keywords
- `location`: Job location
- `distance`: Search radius in kilometers
- `page`: Page number for pagination
- `source`: Job source (default: 'jobbank')

Example:
```
https://your-project.supabase.co/functions/v1/job-search-proxy?keywords=software&location=Toronto&distance=50&page=1
```

## Local Development

To run this project locally:

```bash
npm install
npm run dev
```

## Features

- Military-to-civilian skill translation
- Job search with military background matching
- Resume builder with military experience highlighting
- Career counseling resources
- Interview preparation tools

