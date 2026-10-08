INSERT INTO radio_stations(name,frequency,city,stream_url,sort_order) VALUES
('Buzz FM','89.7 FM','Aba',NULL,1),
('Magic FM','102.9 FM','Aba',NULL,2),
('Enyimba FM','94.3 FM','Aba',NULL,3),
('BCA Radio','88.1 FM','Aba',NULL,4),
('Real FM','99.1 FM','Aba',NULL,5),
('Vision Africa','104.1 FM','Aba',NULL,6),
('Flo FM','94.9 FM','Umuahia',NULL,7)
ON CONFLICT DO NOTHING;

INSERT INTO billboards(zone,title,campaign,enabled,sort_order) VALUES
('Ariaria','ABIA','Abia Development',TRUE,1),
('Ngwa Road','ALEX OTTI','Abia Development',TRUE,1),
('Aba Main Park','NEW ABIA','Abia Development',TRUE,1),
('Faulks Road','ALEX OTTI','Abia Development',TRUE,1),
('Osisioma','NEW ABIA','Abia Development',TRUE,1)
ON CONFLICT DO NOTHING;

INSERT INTO missions(slug,name,description,reward) VALUES
('first-run','First Run','Complete your first Aba run.',500),
('ariaria-hustle','Ariaria Hustle','Pick up and deliver passengers through Ariaria.',800),
('market-run','Market Run','Complete a market-heavy route without a major collision.',1000),
('rain-no-be-problem','Rain No Be Problem','Finish a run during rain.',1200)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO game_config(key,value) VALUES
('zones','["Ariaria","Ngwa Road","Aba Main Park","Faulks Road","Osisioma"]'),
('vehicle_defaults','{"starter":"keke","maxLevel":5}'),
('radio','{"enabled":true,"volume":0.55}')
ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=NOW();
