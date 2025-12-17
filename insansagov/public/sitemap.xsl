<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
  <title>XML Sitemap</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background: #f4f4f4; }
    tr:nth-child(even) { background: #fafafa; }
  </style>
</head>
<body>

<h2>XML Sitemap</h2>

<table>
  <tr>
    <th>URL</th>
    <th>Last Modified</th>
  </tr>

  <xsl:for-each select="//url | //sitemap">
    <tr>
      <td>
        <a href="{loc}">
          <xsl:value-of select="loc"/>
        </a>
      </td>
      <td>
        <xsl:value-of select="lastmod"/>
      </td>
    </tr>
  </xsl:for-each>

</table>

</body>
</html>
</xsl:template>
</xsl:stylesheet>
