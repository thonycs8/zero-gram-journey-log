import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Get plan details from request body
    const { plan = 'basic', currency = 'eur' } = await req.json();
    
    // Define plan pricing
    const plans = {
      basic: {
        eur: { amount: 299, name: 'Plano Basic - ZeroGram', description: 'Receitas e treinos personalizados' }, // 2.99€
        brl: { amount: 999, name: 'Plano Basic - ZeroGram', description: 'Receitas e treinos personalizados' } // R$ 9.99
      },
      premium: {
        eur: { amount: 999, name: 'Plano Premium - ZeroGram', description: 'Análise avançada, coaching e sem anúncios' }, // 9.99€
        brl: { amount: 2990, name: 'Plano Premium - ZeroGram', description: 'Análise avançada, coaching e sem anúncios' } // R$ 29.90
      }
    };

    const selectedPlan = plans[plan]?.[currency];
    if (!selectedPlan) {
      throw new Error("Invalid plan or currency");
    }

    logStep("Plan selected", { plan, currency, amount: selectedPlan.amount });
    
    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("No existing customer found");
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { 
              name: selectedPlan.name,
              description: selectedPlan.description
            },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/planos?subscription=success&plan=${plan}`,
      cancel_url: `${req.headers.get("origin")}/planos?subscription=cancelled`,
      metadata: {
        plan: plan,
        currency: currency
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});