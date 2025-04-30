import {SitemapStream} from 'sitemap';
import { createGzip } from 'zlib';
import Category from '../../models/CategoryModel.js';
import Authority from '../../models/AuthorityModel.js';
import Organization from '../../models/OrganizationModel.js';
import Event from '../../models/EventModel.js';
import axios from 'axios';

const slugGenerator = (title) => {
    return title.
    toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
}


export const generateSitemap = async (req, res) => {
    try{
        res.header('Content-Type', 'application/xml');
        res.header('Content-Encoding', 'gzip');

        const smStream = new SitemapStream({hostname: "https://gyapak.in"});
        const pipeline = smStream.pipe(createGzip());

        // static pages
        smStream.write({url: '/', changefreq: 'daily', priority: 1.0});
        smStream.write({url: '/government-jobs-after-12th', changefreq: 'daily', priority: 1.0});
        smStream.write({url: '/overview', changefreq: 'daily', priority: 1.0});
        smStream.write({url: '/privacy-policy', changefreq: 'daily', priority: 1.0});
        smStream.write({url: '/credits', changefreq: 'daily', priority: 1.0});
        smStream.write({url: '/blog', changefreq: 'daily', priority: 1.0});
        smStream.write({url: '/current-affair', changefreq: 'daily', priority: 1.0});
        smStream.write({url: '/government-calendar', changefreq: 'daily', priority: 1.0});
        // smStream.write({url: '/', changefreq: 'daily', priority: 1.0});

        // https://gyapak.in/government-organisations-under-category?name=Defence
        const categories = await Category.find({}, 'category');
        categories.forEach(category => {
            smStream.write({
                url: `/government-organisations-under-category?name=${encodeURIComponent(category.category)}`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.9
            });
        });

        // https://gyapak.in/state/government-jobs-in-Gujarat-for-12th-pass
        const states = await Authority.find({}, 'name');
        states.forEach(state => {
            smStream.write({
                url: `/state/government-jobs-in-${encodeURIComponent(state.name)}-for-12th-pass`,
                lastmod:new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.9
            });
        });
        
        // https://gyapak.in/organization/government-competitive-exams-after-12th/name=JEE%20Mains
        const organizations = await Organization.find({}, 'abbreviation');
        organizations.forEach(organization => {
            smStream.write({
                url: `/organization/government-competitive-exams-after-12th/name=${encodeURIComponent(organization.abbreviation)}`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 0.9
            });
        });
        
        
        // http://localhost:5173/top-exams-for-government-jobs-in-india/upsc-recruitment-2025?id=67fca7fc84405d0732c7a2f4
        const events = await Event.find({}, 'name updatedAt');
        events.forEach(event => {
            smStream.write({
                url: `/top-exams-for-government-jobs-in-india/${slugGenerator(event.name)}`,
                lastmod: event.updatedAt.toISOString(),
                changefreq: 'daily',
                priority: 0.9
            });
        });

        smStream.end();

        // const sitemapUrl = encodeURIComponent('http://localhost:8383/sitemap.xml');
        // await axios.get(`https://www.bing.com/ping?sitemap=${sitemapUrl}`);
        // console.log("Google's sitemap pinged");

        pipeline.pipe(res).on('error', (err) => {throw err; });
    }
    catch(err){
        console.error(err);
        res.status(500).end();
    }
}