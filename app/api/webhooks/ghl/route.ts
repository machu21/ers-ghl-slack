import { NextRequest, NextResponse } from 'next/server';

// 1. Update interface to match GHL's raw output exactly
interface GHLPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  Company?: string;
  "Expected Start Date"?: string;
  "Industry/Niche"?: string;
  "What will the work schedule be? please include time zone"?: string;
  "What are the tasks and responsibilities"?: string;
  "Target / Goals / KPI’s"?: string;
  Expectation?: string;
  "What is your preferred CRM and dialer"?: string;
  "Will you provide the leads, call script"?: string;
  "How many callers do you need?"?: string;
  "Do you happen to have a website for your business by any chance?"?: string;
  "How much is your budget? please choose from our package"?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: GHLPayload = await request.json();

    console.log("=== INCOMING GHL PAYLOAD ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("============================");

    // 2. Map the messy GHL keys to clean variables
    const firstName = data.first_name || '';
    const lastName = data.last_name || '';
    const email = data.email || 'N/A';
    const phone = data.phone || 'N/A';
    const company = data.Company || 'N/A';
    const expectedStartDate = data['Expected Start Date'] || 'N/A';
    const industry = data['Industry/Niche'] || 'N/A';
    const schedule = data['What will the work schedule be? please include time zone'] || 'N/A';
    const tasks = data['What are the tasks and responsibilities'] || 'N/A';
    const goals = data['Target / Goals / KPI’s'] || 'N/A';
    const expectation = data.Expectation || 'N/A';
    const crm = data['What is your preferred CRM and dialer'] || 'N/A';
    const leadsProvided = data['Will you provide the leads, call script'] || 'N/A';
    const callersNeeded = data['How many callers do you need?'] || 'N/A';
    const website = data['Do you happen to have a website for your business by any chance?'] || 'N/A';
    const budget = data['How much is your budget? please choose from our package'] || 'N/A';

    // 3. Construct Slack markdown message
    const slackMessage = {
      text:
        `🔥 *NEW HOT LEAD ALERT* 🔥\n\n` +
        `*👤 Contact Information:*\n` +
        `• *Name:* ${firstName} ${lastName}\n` +
        `• *Email:* ${email}\n` +
        `• *Phone:* ${phone}\n\n` +
        `*🏢 Business Details:*\n` +
        `• *Company:* ${company}\n` +
        `• *Industry/Niche:* ${industry}\n` +
        `• *Website:* ${website}\n\n` +
        `*📋 Requirements & Scope:*\n` +
        `• *Budget:* ${budget}\n` +
        `• *Callers Needed:* ${callersNeeded}\n` +
        `• *Expected Start Date:* ${expectedStartDate}\n` +
        `• *Schedule:* ${schedule}\n` +
        `• *Tasks:* ${tasks}\n` +
        `• *Goals/KPIs:* ${goals}\n` +
        `• *Expectations:* ${expectation}\n` +
        `• *CRM/Dialer:* ${crm}\n` +
        `• *Leads/Script Provided:* ${leadsProvided}`
    };

    const response = await fetch(process.env.SLACK_WEBHOOK_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack API error: ${errorText}`);
    }

    return NextResponse.json(
      { success: true, message: 'Notification successfully delivered to Slack' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('=== WEBHOOK ERROR ===', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}