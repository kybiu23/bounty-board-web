-- Test data for User table
INSERT INTO "user" (username, email, password, first_name, last_name, is_staff, is_active, is_superuser, date_joined, oauth_provider, membership_status, created_at, updated_at)
VALUES
    ('user1', 'user1@example.com', '$2b$12$1xxxxxxxxxxxxxxxxxxxxuZLbwlOAVXsNqTKbga.gfEOiOaUm.ZTGL2', 'John', 'Doe', FALSE, TRUE, FALSE, NOW() - INTERVAL '30 days', NULL, 'Free', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    ('user2', 'user2@example.com', '$2b$12$2xxxxxxxxxxxxxxxxxxxxuqiVhxKscQcAFXsxe9VJcCvN8D2SvGEC.', 'Jane', 'Smith', FALSE, TRUE, FALSE, NOW() - INTERVAL '25 days', NULL, 'Premium', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    ('user3', 'user3@example.com', '$2b$12$3xxxxxxxxxxxxxxxxxxxxuoJjxGFQM.P2pQ/i.S2E4YPvzZ1Mbhe6', 'Robert', 'Johnson', FALSE, TRUE, FALSE, NOW() - INTERVAL '20 days', 'Google', 'Free', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
    ('user4', 'user4@example.com', '$2b$12$4xxxxxxxxxxxxxxxxxxxxuLQvtJ.FvpMT1J6J/U1kI4QP/wxoP5S.', 'Sarah', 'Williams', FALSE, TRUE, FALSE, NOW() - INTERVAL '15 days', 'Facebook', 'Premium', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
    ('user5', 'user5@example.com', '$2b$12$5xxxxxxxxxxxxxxxxxxxxu5UNF8Qz4TQX6rnzOTYlBYh49bk1YNqG', 'Michael', 'Brown', FALSE, TRUE, FALSE, NOW() - INTERVAL '10 days', NULL, 'Free', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    ('admin', 'admin@example.com', '$2b$12$6xxxxxxxxxxxxxxxxxxxxu8QzTvM/V6vYRTGJIZEMGZr2Pv.pBHSy', 'Admin', 'User', TRUE, TRUE, TRUE, NOW() - INTERVAL '60 days', NULL, 'Premium', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days');

-- Test data for Subreddit table
INSERT INTO subreddit (name, description, created_at, updated_at)
VALUES
    ('forhire', 'A place to post job offers and look for work', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
    ('Jobs4Bitcoins', 'Jobs and tasks that pay in cryptocurrencies', NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days'),
    ('Entrepreneur', 'Discussion about entrepreneurship and business', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
    ('freelance', 'Community for freelancers to share advice and opportunities', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),
    ('gigs', 'Short-term jobs and gigs postings', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'),
    ('techsupport', 'Technical help and support for computer problems', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days'),
    ('DIY', 'Do-it-yourself projects and advice', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    ('SmallBusiness', 'Small business advice and discussions', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    ('marketing', 'Marketing strategies and discussions', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
    ('coding', 'Programming discussions and help', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days');

-- Test data for Post table
INSERT INTO post (reddit_id, title, body, upvotes, comments_count, author, submission_date, subreddit_id, subreddit_name, post_url, manually_added, created_at, updated_at)
VALUES
    ('abcd123', 'I would pay for a simple task management app that integrates with my calendar', 'Looking for something minimalist that just shows what I need to do today along with my calendar events. I''ve tried lots of apps but they''re all too complicated. I''d pay for something simple that just works.', 45, 23, 'productivity_seeker', NOW() - INTERVAL '29 days', 3, 'Entrepreneur', 'https://reddit.com/r/Entrepreneur/comments/abcd123', FALSE, NOW() - INTERVAL '29 days', NOW() - INTERVAL '29 days'),

    ('efgh456', 'I''d pay for someone to create a custom Excel macro for my business', 'I need a complex macro that can analyze sales data across multiple sheets and create reports automatically. Willing to pay for a professional solution. DM me if interested.', 32, 18, 'excel_lover', NOW() - INTERVAL '27 days', 1, 'forhire', 'https://reddit.com/r/forhire/comments/efgh456', FALSE, NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days'),

    ('ijkl789', 'Need a logo designer - willing to pay for quality work', 'Starting a new coffee shop and need a professional logo. I''ll pay for the right design that captures our vibe. Must have portfolio and experience.', 78, 42, 'coffee_entrepreneur', NOW() - INTERVAL '25 days', 1, 'forhire', 'https://reddit.com/r/forhire/comments/ijkl789', FALSE, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),

    ('mnop012', 'Looking for someone to build a Shopify integration, willing to pay', 'Need a developer who can create a custom integration between my Shopify store and our inventory management system. This is a paid project, not looking for free work.', 56, 31, 'ecommerce_store', NOW() - INTERVAL '22 days', 4, 'freelance', 'https://reddit.com/r/freelance/comments/mnop012', FALSE, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),

    ('qrst345', 'I''ll pay if someone can fix my WordPress site issues', 'Having problems with my WordPress site after the latest update. Pages load slowly and some forms don''t work. Willing to pay for someone experienced to fix these issues.', 29, 17, 'wp_user', NOW() - INTERVAL '20 days', 6, 'techsupport', 'https://reddit.com/r/techsupport/comments/qrst345', FALSE, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),

    ('uvwx678', 'Is there a paid service for creating custom meal plans?', 'I need a nutritionist who can create custom meal plans based on my specific dietary needs and fitness goals. Willing to pay for a professional service rather than using generic plans.', 105, 64, 'fitness_foodie', NOW() - INTERVAL '18 days', 3, 'Entrepreneur', 'https://reddit.com/r/Entrepreneur/comments/uvwx678', FALSE, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),

    ('yzab901', 'Who can make this? I''ll pay for a custom plant stand', 'I have a specific design in mind for a multi-tiered plant stand that would fit in my small apartment. Looking for a woodworker who can build this for me. Happy to pay for materials and labor.', 67, 35, 'plant_enthusiast', NOW() - INTERVAL '16 days', 7, 'DIY', 'https://reddit.com/r/DIY/comments/yzab901', FALSE, NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),

    ('cdef234', 'Paid help needed for Python data analysis project', 'I need someone experienced with pandas and matplotlib to help with analyzing a large dataset and creating visualizations. This is a paid opportunity for the right person with experience.', 87, 45, 'data_scientist', NOW() - INTERVAL '13 days', 10, 'coding', 'https://reddit.com/r/coding/comments/cdef234', FALSE, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),

    ('ghij567', 'Need a solution for automated social media posting, willing to pay', 'Looking for a tool or developer who can create a solution for scheduling and posting content across multiple social media platforms with detailed analytics. Budget available for the right solution.', 42, 23, 'marketing_manager', NOW() - INTERVAL '10 days', 9, 'marketing', 'https://reddit.com/r/marketing/comments/ghij567', FALSE, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

    ('klmn890', 'Anyone selling a custom Notion template for project management?', 'I need a comprehensive Notion template for managing client projects in my consulting business. Willing to pay for something well-designed rather than starting from scratch.', 53, 29, 'consultant', NOW() - INTERVAL '7 days', 3, 'Entrepreneur', 'https://reddit.com/r/Entrepreneur/comments/klmn890', FALSE, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

    ('pqrs123', 'I''ll pay for a custom AR filter for my brand', 'Need someone who can create an Instagram/TikTok AR filter with our brand elements for an upcoming campaign. This is a paid project with potential for ongoing work.', 73, 38, 'brand_marketer', NOW() - INTERVAL '5 days', 9, 'marketing', 'https://reddit.com/r/marketing/comments/pqrs123', FALSE, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

    ('tuvw456', 'Looking for someone to build a custom mechanical keyboard, willing to pay', 'Want a fully custom mechanical keyboard with specific switches, keycaps, and case. Not sure how to assemble it myself, so willing to pay someone experienced to build it for me.', 96, 57, 'mech_enthusiast', NOW() - INTERVAL '3 days', 5, 'gigs', 'https://reddit.com/r/gigs/comments/tuvw456', FALSE, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

    ('xyzA789', 'Paid help needed for small business bookkeeping', 'Looking for someone knowledgeable in QuickBooks to help set up and manage bookkeeping for my small business. This would be an ongoing paid position, approximately 5 hours per week.', 48, 27, 'small_biz_owner', NOW() - INTERVAL '2 days', 8, 'SmallBusiness', 'https://reddit.com/r/SmallBusiness/comments/xyzA789', FALSE, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

    ('bcde012', 'I need a custom Shopify theme and will pay well for quality work', 'Our online store needs a unique look. Looking for an experienced Shopify developer who can create a custom theme based on our brand guidelines. Budget is not an issue for the right person.', 112, 68, 'online_retailer', NOW() - INTERVAL '1 day', 2, 'Jobs4Bitcoins', 'https://reddit.com/r/Jobs4Bitcoins/comments/bcde012', FALSE, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

    ('fghi345', 'I''d pay for a personal styling service that works with my existing wardrobe', 'Looking for a stylist who can help me create outfits from clothes I already own and suggest a few key pieces to purchase. Need someone who can work remotely through photos and video calls.', 83, 49, 'fashion_challenged', NOW(), 5, 'gigs', 'https://reddit.com/r/gigs/comments/fghi345', TRUE, NOW(), NOW());

-- Test data for Comment table (actual Reddit comments)
INSERT INTO comment (reddit_id, post_id, parent_comment_id, body, author, upvotes, submission_date, created_at, updated_at)
VALUES
    ('comm123', 1, NULL, 'Have you tried Todoist? It has calendar integration but might be too feature-heavy for what you want.', 'app_developer', 12, NOW() - INTERVAL '29 days' + INTERVAL '2 hours', NOW() - INTERVAL '29 days' + INTERVAL '2 hours', NOW() - INTERVAL '29 days' + INTERVAL '2 hours'),
    ('comm124', 1, 1, 'Yes, I tried it but it''s exactly the kind of app that has too many features for me. I just want something super simple.', 'productivity_seeker', 8, NOW() - INTERVAL '29 days' + INTERVAL '3 hours', NOW() - INTERVAL '29 days' + INTERVAL '3 hours', NOW() - INTERVAL '29 days' + INTERVAL '3 hours'),
    ('comm125', 1, NULL, 'I''m a developer and might be interested in building this. What would you be willing to pay for such an app?', 'indie_coder', 15, NOW() - INTERVAL '29 days' + INTERVAL '5 hours', NOW() - INTERVAL '29 days' + INTERVAL '5 hours', NOW() - INTERVAL '29 days' + INTERVAL '5 hours'),
    ('comm126', 1, 3, 'I''d pay a one-time fee of $20-30 or a subscription of $3-5/month if it was perfect for my needs.', 'productivity_seeker', 10, NOW() - INTERVAL '29 days' + INTERVAL '6 hours', NOW() - INTERVAL '29 days' + INTERVAL '6 hours', NOW() - INTERVAL '29 days' + INTERVAL '6 hours'),

    ('comm223', 2, NULL, 'I can help with this. I specialize in Excel VBA macros for business analytics. DMing you my portfolio.', 'excel_guru', 7, NOW() - INTERVAL '27 days' + INTERVAL '3 hours', NOW() - INTERVAL '27 days' + INTERVAL '3 hours', NOW() - INTERVAL '27 days' + INTERVAL '3 hours'),
    ('comm224', 2, NULL, 'What kind of sales data are you analyzing? I might have a template that could work with some modifications.', 'data_analyst', 5, NOW() - INTERVAL '27 days' + INTERVAL '5 hours', NOW() - INTERVAL '27 days' + INTERVAL '5 hours', NOW() - INTERVAL '27 days' + INTERVAL '5 hours'),

    ('comm323', 3, NULL, 'Professional logo designer here with 8 years experience. Would love to work on your coffee shop logo. I can send you my portfolio if interested.', 'design_pro', 22, NOW() - INTERVAL '25 days' + INTERVAL '2 hours', NOW() - INTERVAL '25 days' + INTERVAL '2 hours', NOW() - INTERVAL '25 days' + INTERVAL '2 hours'),
    ('comm324', 3, 7, 'Yes please, send your portfolio. Looking for someone who understands the coffee shop aesthetic.', 'coffee_entrepreneur', 8, NOW() - INTERVAL '25 days' + INTERVAL '3 hours', NOW() - INTERVAL '25 days' + INTERVAL '3 hours', NOW() - INTERVAL '25 days' + INTERVAL '3 hours'),

    ('comm423', 4, NULL, 'I''ve built several custom Shopify integrations. What inventory system are you using? That will help determine the approach.', 'ecom_dev', 17, NOW() - INTERVAL '22 days' + INTERVAL '4 hours', NOW() - INTERVAL '22 days' + INTERVAL '4 hours', NOW() - INTERVAL '22 days' + INTERVAL '4 hours'),
    ('comm424', 4, 9, 'We''re using Cin7. Need real-time inventory syncing across multiple sales channels.', 'ecommerce_store', 6, NOW() - INTERVAL '22 days' + INTERVAL '5 hours', NOW() - INTERVAL '22 days' + INTERVAL '5 hours', NOW() - INTERVAL '22 days' + INTERVAL '5 hours'),

    ('comm523', 5, NULL, 'WordPress developer here. These issues are usually caused by plugin conflicts or a theme update. I can fix this for you.', 'wp_expert', 8, NOW() - INTERVAL '20 days' + INTERVAL '3 hours', NOW() - INTERVAL '20 days' + INTERVAL '3 hours', NOW() - INTERVAL '20 days' + INTERVAL '3 hours'),

    ('comm623', 6, NULL, 'I''m a registered dietitian and create custom meal plans. I charge $150 for a 4-week personalized plan with shopping lists and recipes.', 'nutrition_expert', 32, NOW() - INTERVAL '18 days' + INTERVAL '2 hours', NOW() - INTERVAL '18 days' + INTERVAL '2 hours', NOW() - INTERVAL '18 days' + INTERVAL '2 hours'),

    ('comm723', 7, NULL, 'I''m a woodworker who specializes in furniture for small spaces. I''d be happy to build this for you. Can you share more details about the design?', 'wood_craftsman', 19, NOW() - INTERVAL '16 days' + INTERVAL '4 hours', NOW() - INTERVAL '16 days' + INTERVAL '4 hours', NOW() - INTERVAL '16 days' + INTERVAL '4 hours'),

    ('comm823', 8, NULL, 'Data scientist here with pandas/matplotlib experience. What kind of dataset are you working with and what visualizations do you need?', 'python_analyst', 23, NOW() - INTERVAL '13 days' + INTERVAL '3 hours', NOW() - INTERVAL '13 days' + INTERVAL '3 hours', NOW() - INTERVAL '13 days' + INTERVAL '3 hours'),

    ('comm923', 9, NULL, 'Have you looked at Buffer or Hootsuite? They might do what you need without having to build something custom.', 'social_media_manager', 11, NOW() - INTERVAL '10 days' + INTERVAL '5 hours', NOW() - INTERVAL '10 days' + INTERVAL '5 hours', NOW() - INTERVAL '10 days' + INTERVAL '5 hours');

-- Test data for Notification table
INSERT INTO notification (user_id, type, content, read_status, created_at, updated_at)
VALUES
    (1, 'New Post', 'A new post matching your interests has been added: "I would pay for a simple task management app"', FALSE, NOW() - INTERVAL '29 days', NOW() - INTERVAL '29 days'),
    (2, 'Account Update', 'Your premium membership has been activated successfully.', TRUE, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    (3, 'New Post', 'A new post matching your interests has been added: "Need a logo designer - willing to pay for quality work"', FALSE, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
    (4, 'Membership Change', 'Your premium membership will expire in 7 days. Please renew to continue enjoying premium benefits.', FALSE, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
    (1, 'New Post', 'A new post matching your interests has been added: "Looking for someone to build a Shopify integration"', TRUE, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
    (5, 'Account Update', 'Your account password was recently changed. If this wasn''t you, please contact support.', FALSE, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
    (2, 'New Post', 'A new post matching your interests has been added: "I''ll pay if someone can fix my WordPress site issues"', TRUE, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
    (3, 'New Post', 'A new post matching your interests has been added: "Is there a paid service for creating custom meal plans?"', FALSE, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
    (4, 'Membership Change', 'Your premium membership has been renewed successfully.', TRUE, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
    (1, 'New Post', 'A new post matching your interests has been added: "Paid help needed for Python data analysis project"', FALSE, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days');

-- Test data for Subscription table
INSERT INTO subscription (user_id, stripe_subscription_id, status, created_at, expires_at, updated_at)
VALUES
    (2, 'sub_123456789abcdef', 'active', NOW() - INTERVAL '25 days', NOW() + INTERVAL '5 days', NOW() - INTERVAL '25 days'),
    (4, 'sub_abcdef123456789', 'active', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', NOW() - INTERVAL '15 days'),
    (6, 'sub_987654321fedcba', 'active', NOW() - INTERVAL '60 days', NOW() + INTERVAL '30 days', NOW() - INTERVAL '30 days'),
    (1, 'sub_111222333444555', 'cancelled', NOW() - INTERVAL '40 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
    (3, 'sub_555444333222111', 'cancelled', NOW() - INTERVAL '50 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days');

-- Test data for Keyword table
INSERT INTO keyword (phrase, description, active, created_at, updated_at)
VALUES
    ('I''d pay for', 'Direct willingness to pay for a solution', TRUE, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
    ('I would pay for', 'Direct willingness to pay for a solution', TRUE, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
    ('willing to pay', 'Indicates readiness to pay for a service', TRUE, NOW() - INTERVAL '59 days', NOW() - INTERVAL '59 days'),
    ('looking for someone to build', 'Seeking a developer or creator to build something', TRUE, NOW() - INTERVAL '58 days', NOW() - INTERVAL '58 days'),
    ('need a solution for', 'Seeking a solution to a problem', TRUE, NOW() - INTERVAL '57 days', NOW() - INTERVAL '57 days'),
    ('paid help needed', 'Explicitly stating payment for assistance', TRUE, NOW() - INTERVAL '56 days', NOW() - INTERVAL '56 days'),
    ('I''ll pay if someone can', 'Conditional payment for solving a problem', TRUE, NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days'),
    ('who can make this? I''ll pay', 'Seeking creator with payment offered', TRUE, NOW() - INTERVAL '54 days', NOW() - INTERVAL '54 days'),
    ('is there a paid service for', 'Looking for commercial services', TRUE, NOW() - INTERVAL '53 days', NOW() - INTERVAL '53 days'),
    ('anyone selling a', 'Looking to purchase a product', TRUE, NOW() - INTERVAL '52 days', NOW() - INTERVAL '52 days'),
    ('budget available', 'Indicates money allocated for a project', TRUE, NOW() - INTERVAL '51 days', NOW() - INTERVAL '51 days'),
    ('pay a developer to', 'Seeking paid programming work', TRUE, NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days'),
    ('commission', 'Often used when seeking creative paid work', FALSE, NOW() - INTERVAL '49 days', NOW() - INTERVAL '49 days');

-- Test data for CrawlHistory table
INSERT INTO crawl_history (subreddit_id, start_time, end_time, posts_found, comments_found, status, error_message, created_at)
VALUES
    (1, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days' + INTERVAL '30 minutes', 12, 78, 'completed', NULL, NOW() - INTERVAL '30 days'),
    (2, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days' + INTERVAL '25 minutes', 8, 45, 'completed', NULL, NOW() - INTERVAL '30 days'),
    (3, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days' + INTERVAL '40 minutes', 15, 92, 'completed', NULL, NOW() - INTERVAL '30 days'),
    (4, NOW() - INTERVAL '29 days', NOW() - INTERVAL '29 days' + INTERVAL '35 minutes', 10, 67, 'completed', NULL, NOW() - INTERVAL '29 days'),
    (5, NOW() - INTERVAL '29 days', NOW() - INTERVAL '29 days' + INTERVAL '20 minutes', 6, 41, 'completed', NULL, NOW() - INTERVAL '29 days'),
    (6, NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days' + INTERVAL '45 minutes', 14, 83, 'completed', NULL, NOW() - INTERVAL '28 days'),
    (7, NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days' + INTERVAL '30 minutes', 9, 52, 'completed', NULL, NOW() - INTERVAL '28 days'),
    (8, NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days' + INTERVAL '25 minutes', 7, 38, 'completed', NULL, NOW() - INTERVAL '27 days'),
    (9, NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days' + INTERVAL '35 minutes', 11, 73, 'completed', NULL, NOW() - INTERVAL '27 days'),
    (10, NOW() - INTERVAL '26 days', NOW() - INTERVAL '26 days' + INTERVAL '40 minutes', 13, 81, 'completed', NULL, NOW() - INTERVAL '26 days'),
    (1, NOW() - INTERVAL '26 days', NULL, 0, 0, 'failed', 'API rate limit exceeded', NOW() - INTERVAL '26 days'),
    (3, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days' + INTERVAL '38 minutes', 9, 62, 'completed', NULL, NOW() - INTERVAL '25 days'),
    (5, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days' + INTERVAL '22 minutes', 5, 31, 'completed', NULL, NOW() - INTERVAL '25 days'),
    (7, NOW() - INTERVAL '24 days', NOW() - INTERVAL '24 days' + INTERVAL '33 minutes', 8, 47, 'completed', NULL, NOW() - INTERVAL '24 days'),
    (9, NOW() - INTERVAL '24 days', NOW() - INTERVAL '24 days' + INTERVAL '37 minutes', 10, 65, 'completed', NULL, NOW() - INTERVAL '24 days'),
    (2, NOW() - INTERVAL '23 days', NOW() - INTERVAL '23 days' + INTERVAL '26 minutes', 7, 43, 'completed', NULL, NOW() - INTERVAL '23 days'),
    (4, NOW() - INTERVAL '23 days', NOW() - INTERVAL '23 days' + INTERVAL '31 minutes', 9, 58, 'completed', NULL, NOW() - INTERVAL '23 days'),
    (6, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days' + INTERVAL '42 minutes', 12, 76, 'completed', NULL, NOW() - INTERVAL '22 days'),
    (8, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days' + INTERVAL '28 minutes', 6, 35, 'completed', NULL, NOW() - INTERVAL '22 days'),
    (10, NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days' + INTERVAL '36 minutes', 11, 69, 'completed', NULL, NOW() - INTERVAL '21 days');