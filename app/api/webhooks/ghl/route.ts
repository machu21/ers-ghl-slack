import { NextRequest, NextResponse } from 'next/server';

interface GHLPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  expectedStartDate?: string;
  industry?: string;
  schedule?: string;
  tasks?: string;
  goals?: string;
  expectation?: string;
  crm?: string;
  leadsProvided?: string;
  callersNeeded?: string;
  website?: string;
  budget?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: GHLPayload = await request.json();

    // 🔴 ADD THIS DEBUG LOG HERE 🔴
    console.log("=== INCOMING GHL PAYLOAD ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("============================");

    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      expectedStartDate,
      industry,
      schedule,
      tasks,
      goals,
      expectation,
      crm,
      leadsProvided,
      callersNeeded,
      website,
      budget,
    } = data;

    const slackMessage = {
      text:
        `🔥 *NEW HOT LEAD ALERT* 🔥\n\n` +
        `*👤 Contact Information:*\n` +
        `• *Name:* ${firstName || ''} ${lastName || ''}\n` +
        `• *Email:* ${email || 'N/A'}\n` +
        `• *Phone:* ${phone || 'N/A'}\n\n` +
        `*🏢 Business Details:*\n` +
        `• *Company:* ${company || 'N/A'}\n` +
        `• *Industry/Niche:* ${industry || 'N/A'}\n` +
        `• *Website:* ${website || 'N/A'}\n\n` +
        `*📋 Requirements & Scope:*\n` +
        `• *Budget:* ${budget || 'N/A'}\n` +
        `• *Callers Needed:* ${callersNeeded || 'N/A'}\n` +
        `• *Expected Start Date:* ${expectedStartDate || 'N/A'}\n` +
        `• *Schedule:* ${schedule || 'N/A'}\n` +
        `• *Tasks:* ${tasks || 'N/A'}\n` +
        `• *Goals/KPIs:* ${goals || 'N/A'}\n` +
        `• *Expectations:* ${expectation || 'N/A'}\n` +
        `• *CRM/Dialer:* ${crm || 'N/A'}\n` +
        `• *Leads/Script Provided:* ${leadsProvided || 'N/A'}`
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
    // Also log any errors that occur
    console.error('=== WEBHOOK ERROR ===', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}