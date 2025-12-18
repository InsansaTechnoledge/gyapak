import React from 'react'

const SeoIntro = () => {
  return (
    <div className='mx-auto max-w-7xl mt-10 text-md rounded-sm px-3 py-4 bg-white/60 backdrop-blur'>
        <p className='text-gray-500 text-xl font-medium'>
          What functions can we do?
        </p>

        <ul className='list-decimal list-inside mt-6 space-y-3 text-gray-800 leading-relaxed'>
          <li>
            <strong>Publish URL to Google Indexing API (Job pages):</strong>{' '}
            Notify Google about new or updated <span className='font-semibold'>JobPosting</span> pages so they are
            discovered and crawled faster.
          </li>

          <li>
            <strong>Remove expired job URLs from Google Indexing API:</strong>{' '}
            Tell Google when a job is closed or deleted so that outdated listings
            are cleaned up from search results.
          </li>

          <li>
            <strong>Submit sitemap to Google Search Console:</strong>{' '}
            Ping Google whenever your sitemap (or specific sitemap segment) is
            updated so new exams, jobs, and current affairs are discovered quickly.
          </li>

          <li>
            <strong>Check performance of the website:</strong>{' '}
            Retrieve clicks, impressions, CTR, and average position from Google
            Search Console to analyse how Gyapak is performing in search.
          </li>

          <li>
            <strong>View top queries and pages:</strong>{' '}
            See which search queries bring users to Gyapak and which pages are
            getting the most clicks and impressions.
          </li>

          <li>
            <strong>Inspect any URL (URL Inspection API):</strong>{' '}
            Check whether a specific URL is indexed, its coverage status,
            last crawl time, canonical URL, robots state, and other technical
            SEO details directly inside the admin panel.
          </li>

          <li>
            <strong>Open inspected URL directly in Search Console:</strong>{' '}
            From the inspection data, jump to the official Search Console
            “URL Inspection” view for deeper debugging with one click.
          </li>

          <li>
            <strong>Centralised SEO dashboard inside admin:</strong>{' '}
            All these tools (indexing, inspection, performance, sitemaps) are
            available in one place so you don’t have to switch between Gyapak
            and Google Search Console again and again.
          </li>
        </ul>

        <p className='mt-6 text-sm text-gray-500 italic'>
          Note: Indexing API is used only for valid <span className='font-semibold'>JobPosting</span> pages.
          Normal pages (exams, articles, current affairs) are indexed via sitemaps
          and internal links, and their status can be checked using the URL Inspection tool.
        </p>
    </div>
  )
}

export default SeoIntro
