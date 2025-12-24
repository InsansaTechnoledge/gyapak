<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          
          #header {
            background-color: #fff;
            border-bottom: 1px solid #ddd;
            padding: 20px 40px;
            margin-bottom: 30px;
          }
          
          #header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            color: #1a1a1a;
          }
          
          #header p {
            margin: 10px 0 0 0;
            color: #666;
            font-size: 14px;
          }
          
          #content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 40px 40px;
          }
          
          .intro {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border: 1px solid #e0e0e0;
          }
          
          .intro h2 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #1a1a1a;
          }
          
          .intro p {
            margin: 5px 0;
            line-height: 1.6;
            color: #666;
          }
          
          .intro a {
            color: #0066cc;
            text-decoration: none;
          }
          
          .intro a:hover {
            text-decoration: underline;
          }
          
          #sitemap {
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          thead {
            background-color: #f8f9fa;
          }
          
          th {
            text-align: left;
            padding: 15px 20px;
            font-weight: 600;
            font-size: 13px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e0e0e0;
          }
          
          tr {
            border-bottom: 1px solid #f0f0f0;
          }
          
          tr:last-child {
            border-bottom: none;
          }
          
          tbody tr:hover {
            background-color: #f8f9fa;
          }
          
          td {
            padding: 15px 20px;
            color: #333;
          }
          
          td.url {
            max-width: 600px;
            word-break: break-all;
          }
          
          td.url a {
            color: #0066cc;
            text-decoration: none;
            font-weight: 500;
          }
          
          td.url a:hover {
            text-decoration: underline;
          }
          
          td.priority, td.changefreq {
            color: #666;
            font-size: 13px;
          }
          
          td.lastmod {
            color: #666;
            font-size: 13px;
            white-space: nowrap;
          }
          
          .count {
            background: #e3f2fd;
            color: #1976d2;
            padding: 5px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
            display: inline-block;
            margin-top: 10px;
          }
          
          @media (max-width: 768px) {
            #header, #content {
              padding-left: 20px;
              padding-right: 20px;
            }
            
            table {
              font-size: 12px;
            }
            
            th, td {
              padding: 10px;
            }
            
            .priority-col, .changefreq-col {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div id="header">
          <h1>XML Sitemap</h1>
          <p>This sitemap contains <span class="count"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></span> URLs</p>
        </div>
        
        <div id="content">
          <div class="intro">
            <h2>About XML Sitemaps</h2>
            <p>This is an XML Sitemap which is supposed to be processed by search engines that follow the XML Sitemap standard like Google, Bing, and others.</p>
            <p>You can find more information about XML sitemaps on <a href="https://www.sitemaps.org" target="_blank">sitemaps.org</a>.</p>
          </div>
          
          <div id="sitemap">
            <table>
              <thead>
                <tr>
                  <th style="width: 50%;">URL</th>
                  <th class="priority-col" style="width: 10%;">Priority</th>
                  <th class="changefreq-col" style="width: 15%;">Change Freq.</th>
                  <th style="width: 25%;">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td class="url">
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}" target="_blank">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="priority priority-col">
                      <xsl:value-of select="sitemap:priority"/>
                    </td>
                    <td class="changefreq changefreq-col">
                      <xsl:value-of select="sitemap:changefreq"/>
                    </td>
                    <td class="lastmod">
                      <xsl:value-of select="sitemap:lastmod"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>