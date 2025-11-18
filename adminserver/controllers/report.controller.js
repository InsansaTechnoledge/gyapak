import Authority from '../models/AuthorityModel.js';
import { Blog } from '../models/BlogPost.model.js';
import Category from '../models/CategoryModel.js';
import { CurrentAffair } from '../models/currentAffairs.models.js';
import Event from '../models/EventModel.js';
import FAQ from '../models/FAQ.model.js';
import Organization from '../models/OrganizationModel.js';
import Question from '../models/QuestionsModel.js';
import ExcelJS from 'exceljs';
import {generateCriticalEventsBookletPDF} from '../utils/criticalEventBooklet.js';

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/** Convert start/end into concise label */
const getDateRangeLabel = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${MONTH_SHORT[start.getMonth()]} ${start.getFullYear()}`;
  } else if (start.getFullYear() === end.getFullYear()) {
    return `${MONTH_SHORT[start.getMonth()]} - ${MONTH_SHORT[end.getMonth()]} ${start.getFullYear()}`;
  } else {
    return `${MONTH_SHORT[start.getMonth()]} ${start.getFullYear()} - ${MONTH_SHORT[end.getMonth()]} ${end.getFullYear()}`;
  }
};

/** Return startDate (00:00) and endDate (23:59:59.999) for period string */
const getDateRange = (period = '7days') => {
  const now = new Date();
  now.setHours(23,59,59,999);
  let startDate;
  switch(period) {
    case '7days': startDate = new Date(now.getTime() - 7 * 24*60*60*1000); break;
    case '15days': startDate = new Date(now.getTime() - 15 * 24*60*60*1000); break;
    case '1month': startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); break;
    case '2months': startDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate()); break;
    case '3months': startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()); break;
    default: startDate = new Date(now.getTime() - 7 * 24*60*60*1000);
  }
  startDate.setHours(0,0,0,0);
  return { startDate, endDate: now };
};

/** Build month-wise breakdown */
const getMonthWiseBreakdown = async (startDate, endDate) => {
  const monthlyData = [];
  const current = new Date(startDate);
  current.setDate(1);
  while (current <= endDate) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23,59,59,999);

    const [events, blogs, questions, currentAffairs, faqs, organizations] = await Promise.all([
      Event.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      Blog.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      Question.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      CurrentAffair.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      FAQ.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } }),
      Organization.countDocuments({ createdAt: { $gte: monthStart, $lte: monthEnd } })
    ]);

    monthlyData.push({
      month: MONTH_FULL[current.getMonth()],
      year: current.getFullYear(),
      label: `${MONTH_SHORT[current.getMonth()]} ${current.getFullYear()}`,
      data: { events, blogs, questions, currentAffairs, faqs, organizations, total: events + blogs + questions + currentAffairs + faqs + organizations }
    });

    current.setMonth(current.getMonth() + 1);
  }
  return monthlyData;
};


export const generateReportData = async (period = '7days') => {
  const { startDate, endDate } = getDateRange(period);
  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24*60*60*1000);
  const fiveDaysFromNow = new Date(now.getTime() + 5 * 24*60*60*1000);
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24*60*60*1000);

  // Counts (parallel)
  const [
    authoritiesCount,
    blogsCount,
    categoriesCount,
    currentAffairsCount,
    eventsCount,
    faqsCount,
    organizationsCount,
    questionsCount
  ] = await Promise.all([
    Authority.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    Blog.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    Category.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    CurrentAffair.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    Event.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    FAQ.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    Organization.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    Question.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } })
  ]);

  // Monthly breakdown (may be a few queries)
  const monthlyBreakdown = await getMonthWiseBreakdown(startDate, endDate);

  // Upcoming events categories and recently added
  const [urgentEvents, soonEvents, upcomingEvents, recentlyAddedEvents] = await Promise.all([
    Event.find({ end_date: { $gte: now, $lte: twoDaysFromNow } })
      .populate({ path:'organization_id', select:'name abbreviation category' ,populate:{ path:'category', select:'category' } })
      .select('name date_of_commencement end_date event_type organization_id apply_link briefDetails createdAt')
      .sort({ end_date: 1 }),

    Event.find({ end_date: { $gt: twoDaysFromNow, $lte: fiveDaysFromNow } })
      .populate({ path:'organization_id', select:'name abbreviation category' ,populate:{ path:'category', select:'category' } })
      .select('name date_of_commencement end_date event_type organization_id briefDetails')
      .sort({ end_date: 1 })
      .limit(20),

    Event.find({ end_date: { $gt: fiveDaysFromNow, $lte: sevenDaysFromNow } })
      .populate({ path:'organization_id', select:'name abbreviation category' ,populate:{ path:'category', select:'category' } })
      .select('name date_of_commencement end_date event_type organization_id briefDetails')
      .sort({ end_date: 1 })
      .limit(20),

    Event.find({ createdAt: { $gte: startDate } })
      .populate({ path:'organization_id', select:'name abbreviation category' ,populate:{ path:'category', select:'category' } })
      .select('name event_type createdAt organization_id briefDetails')
      .sort({ createdAt: -1 })
      .limit(20)
  ]);

  // Blog analytics & top authors
  const [recentBlogs, featuredBlogsCount, topAuthors] = await Promise.all([
    Blog.find({ createdAt: { $gte: startDate } })
      .select('title author.name createdAt readTime tags excerpt')
      .sort({ createdAt: -1 })
      .limit(10),

    Blog.countDocuments({ createdAt: { $gte: startDate }, featuredPost: true }),

    Blog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$author.name', count: { $sum: 1 }, totalReadTime: { $sum: '$readTime' } }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  // Current affairs breakdown
  const affairsBreakdown = await CurrentAffair.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $unwind: '$affairs' },
    { $group: { _id: '$affairs.category', count: { $sum: 1 } }},
    { $sort: { count: -1 } }
  ]);

  // Question analytics
  const [questionStats, questionsByCategory] = await Promise.all([
    Question.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } }}
    ]),
    Question.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  // FAQ by state
  const faqByState = await FAQ.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: { _id: '$state', count: { $sum: 1 } }},
    { $sort: { count: -1 } },
    { $limit: 15 }
  ]);

  // Event type distribution
  const eventTypeDistribution = await Event.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: { _id: '$event_type', count: { $sum: 1 } }}
  ]);

  // Organization activity (lookup events and count ones created since startDate)
  const organizationActivity = await Organization.aggregate([
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: 'organization_id',
        as: 'events'
      }
    },
    {
      $addFields: {
        recentEvents: {
          $filter: {
            input: '$events',
            as: 'event',
            cond: { $gte: ['$$event.createdAt', startDate] }
          }
        }
      }
    },
    {
      $match: { 'recentEvents.0': { $exists: true } }
    },
    {
      $project: { name: 1, abbreviation: 1, eventCount: { $size: '$recentEvents' } }
    },
    { $sort: { eventCount: -1 } },
    { $limit: 15 }
  ]);

  const calculateDaysRemaining = (endDate) => {
    const diff = new Date(endDate) - now;
    return Math.ceil(diff / (1000*60*60*24));
  };

  // Map urgent events to plain objects with daysRemaining and urgencyLevel
  const urgentMapped = urgentEvents.map(e => {
    const obj = e.toObject ? e.toObject() : e;
    return { ...obj, daysRemaining: calculateDaysRemaining(obj.end_date), urgencyLevel: 'critical' };
  });

  const soonMapped = soonEvents.map(e => {
    const obj = e.toObject ? e.toObject() : e;
    return { ...obj, daysRemaining: calculateDaysRemaining(obj.end_date), urgencyLevel: 'high' };
  });

  const upcomingMapped = upcomingEvents.map(e => {
    const obj = e.toObject ? e.toObject() : e;
    return { ...obj, daysRemaining: calculateDaysRemaining(obj.end_date), urgencyLevel: 'medium' };
  });

  return {
    reportGenerated: now,
    period: { from: startDate, to: endDate, range: period, label: getDateRangeLabel(startDate, endDate) },
    summary: {
      totalEntries: authoritiesCount + blogsCount + categoriesCount + currentAffairsCount + eventsCount + faqsCount + organizationsCount + questionsCount,
      bySection: {
        authorities: authoritiesCount,
        blogs: blogsCount,
        categories: categoriesCount,
        currentAffairs: currentAffairsCount,
        events: eventsCount,
        faqs: faqsCount,
        organizations: organizationsCount,
        questions: questionsCount
      }
    },
    monthlyBreakdown,
    upcomingEvents: {
      urgent: urgentMapped,
      soon: soonMapped,
      upcoming: upcomingMapped,
      recentlyAdded: recentlyAddedEvents
    },
    blogAnalytics: { recentBlogs, featuredCount: featuredBlogsCount, topAuthors },
    currentAffairsBreakdown: affairsBreakdown,
    questionStatistics: { byDifficulty: questionStats, byCategory: questionsByCategory, total: questionsCount },
    faqAnalytics: { byState: faqByState, total: faqsCount },
    eventTypeDistribution,
    organizationActivity,
    insights: {
      mostActiveSection: Object.entries({
        Authorities: authoritiesCount,
        Blogs: blogsCount,
        Categories: categoriesCount,
        'Current Affairs': currentAffairsCount,
        Events: eventsCount,
        FAQs: faqsCount,
        Organizations: organizationsCount,
        Questions: questionsCount
      }).reduce((a,b)=> a[1] > b[1] ? a : b)[0],
      criticalEventsCount: urgentMapped.length,
      totalUpcomingEvents: urgentMapped.length + soonMapped.length + upcomingMapped.length,
      growthIndicator: (eventsCount + blogsCount + questionsCount) > 10 ? 'High' : (eventsCount + blogsCount + questionsCount) > 5 ? 'Moderate' : 'Low'
    }
  };
};

export const getReport = async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    const report = await generateReportData(period);
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ success: false, message: 'Error generating report', error: error.message });
  }
};

/** Download critical-events booklet PDF (uses puppeteer) */
export const downloadPDF = async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    const report = await generateReportData(period);

    const pdfBuffer = await generateCriticalEventsBookletPDF(report);
    console.log("PDF SIZE:", pdfBuffer.length);


    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=gyapak-critical-events-${period}-${Date.now()}.pdf`);
    return res.end(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ success: false, message: 'Error generating PDF', error: error.message });
  }
};

/** Download Excel (kept functionally same, cleaned up) */
export const downloadExcel = async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    const report = await generateReportData(period);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'GYAPAK Admin System';
    workbook.created = new Date();

    // SUMMARY sheet
    const summarySheet = workbook.addWorksheet('Summary', { properties: { tabColor: { argb: '1e40af' } }});
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 35 },
      { header: 'Value', key: 'value', width: 40 }
    ];
    summarySheet.getRow(1).font = { bold: true, size: 12 };
    summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1e40af' } };
    summarySheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

    summarySheet.addRow({ metric: 'Report Period', value: report.period.label });
    summarySheet.addRow({ metric: 'Generated On', value: new Date().toLocaleString() });
    summarySheet.addRow({});
    summarySheet.addRow({ metric: 'OVERALL SUMMARY', value: '' }).font = { bold: true };
    summarySheet.addRow({ metric: 'Total Entries', value: report.summary.totalEntries });
    summarySheet.addRow({ metric: 'Critical Events', value: report.insights.criticalEventsCount });
    summarySheet.addRow({ metric: 'Most Active Section', value: report.insights.mostActiveSection });
    summarySheet.addRow({ metric: 'Growth Indicator', value: report.insights.growthIndicator });
    summarySheet.addRow({});
    summarySheet.addRow({ metric: 'SECTION BREAKDOWN', value: '' }).font = { bold: true };

    Object.entries(report.summary.bySection).forEach(([key, value]) => {
      summarySheet.addRow({ metric: key.charAt(0).toUpperCase() + key.slice(1), value });
    });

    // MONTHLY sheet
    const monthlySheet = workbook.addWorksheet('Monthly Trends');
    monthlySheet.columns = [
      { header: 'Month', key: 'month', width: 20 },
      { header: 'Events', key: 'events', width: 12 },
      { header: 'Blogs', key: 'blogs', width: 12 },
      { header: 'Questions', key: 'questions', width: 12 },
      { header: 'Current Affairs', key: 'affairs', width: 15 },
      { header: 'FAQs', key: 'faqs', width: 12 },
      { header: 'Total', key: 'total', width: 12 }
    ];
    monthlySheet.getRow(1).font = { bold: true };
    monthlySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '10b981' } };
    monthlySheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

    report.monthlyBreakdown.forEach((month) => {
      monthlySheet.addRow({
        month: `${month.month} ${month.year}`,
        events: month.data.events,
        blogs: month.data.blogs,
        questions: month.data.questions,
        affairs: month.data.currentAffairs,
        faqs: month.data.faqs,
        total: month.data.total
      });
    });

    // CRITICAL EVENTS sheet
    const eventsSheet = workbook.addWorksheet('Critical Events');
    eventsSheet.columns = [
      { header: 'Event Name', key: 'name', width: 45 },
      { header: 'Organization', key: 'org', width: 25 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Days Remaining', key: 'days', width: 15 },
      { header: 'End Date', key: 'endDate', width: 15 },
      { header: 'Details', key: 'details', width: 50 }
    ];
    eventsSheet.getRow(1).font = { bold: true };
    eventsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'dc2626' } };
    eventsSheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

    report.upcomingEvents.urgent.forEach(e => {
      eventsSheet.addRow({
        name: e.name,
        org: `${e.organization_id?.name || 'Unknown'}${e.organization_id?.abbreviation ? ' (' + e.organization_id.abbreviation + ')' : ''}`,
        type: e.event_type,
        days: e.daysRemaining,
        endDate: e.end_date ? new Date(e.end_date).toLocaleDateString() : '',
        details: e.briefDetails || ''
      });
    });

    // UPCOMING sheet
    const upcomingSheet = workbook.addWorksheet('Upcoming Events');
    upcomingSheet.columns = [
      { header: 'Event Name', key: 'name', width: 45 },
      { header: 'Organization', key: 'org', width: 25 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Days Remaining', key: 'days', width: 15 },
      { header: 'End Date', key: 'endDate', width: 15 }
    ];
    upcomingSheet.getRow(1).font = { bold: true };
    upcomingSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ea580c' } };
    upcomingSheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

    report.upcomingEvents.soon.forEach(e => {
      upcomingSheet.addRow({
        name: e.name,
        org: `${e.organization_id?.name || 'Unknown'}${e.organization_id?.abbreviation ? ' (' + e.organization_id.abbreviation + ')' : ''}`,
        type: e.event_type,
        days: e.daysRemaining,
        endDate: e.end_date ? new Date(e.end_date).toLocaleDateString() : ''
      });
    });

    // Current affairs sheet
    const affairsSheet = workbook.addWorksheet('Current Affairs');
    affairsSheet.columns = [
      { header: 'Category', key: 'category', width: 30 },
      { header: 'Count', key: 'count', width: 15 }
    ];
    affairsSheet.getRow(1).font = { bold: true };
    affairsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '8b5cf6' } };
    affairsSheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

    report.currentAffairsBreakdown.forEach(item => {
      affairsSheet.addRow({ category: item._id, count: item.count });
    });

    // Organizations sheet
    const orgSheet = workbook.addWorksheet('Organizations');
    orgSheet.columns = [
      { header: 'Organization Name', key: 'name', width: 40 },
      { header: 'Abbreviation', key: 'abbr', width: 20 },
      { header: 'Events Count', key: 'count', width: 15 }
    ];
    orgSheet.getRow(1).font = { bold: true };
    orgSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'f59e0b' } };
    orgSheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

    report.organizationActivity.forEach(org => {
      orgSheet.addRow({ name: org.name, abbr: org.abbreviation, count: org.eventCount });
    });

    // Send workbook
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=gyapak-report-${period}-${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel:', error);
    return res.status(500).json({ success: false, message: 'Error generating Excel', error: error.message });
  }
};
