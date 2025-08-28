The Central Core: The Brain 🧠
The central core is a single Blueprint Actor in Unreal Engine that monitors and manages everything. Its primary function is to maintain the city's livability by ensuring all resources and systems are operating within optimal parameters. It acts as the central hub for all data and commands.

Proposed Variables (Internal Data):

Current_Population (Integer)

Overall_Efficiency (Float between 0.0 and 1.0)

Energy_Stockpile (Float)

Food_Stockpile (Float)

Water_Stockpile (Float)

Raw_Materials_Stockpile (Map: String -> Float)

Reclaimed_Materials_Stockpile (Map: String -> Float)

Transportation_Flow_Rate (Float)

Key Functions (Logic):

Update_City_Status(): A function that runs constantly to check all system variables and calculate a real-time Overall_Efficiency score.

Resource_Demand_Calculation(): Calculates the total resource needs based on Current_Population and sends this data to the relevant rings.

Issue_Production_Commands(): Sends commands to the production rings (e.g., "increase food production by 15%").

Broadcast_Alerts(): Sends an alert to all systems if System_Integrity drops.

Maintain_Environmental_Balance(): Monitors pollution, waste, and climate and adjusts other systems to compensate.

First Ring (Core Systems)
This ring is where all the high-level, essential systems are housed. Think of it as the city's nervous system. Its key role is to manage and report on the city's foundational health and research.

Proposed Variables:

Medical_System_Status (Enum: Healthy, Overloaded, Critical)

Active_Research_Projects (Array of Strings)

Total_CADCAM_Production_Requests (Integer)

Environmental_State_Data (Map: String -> Float, e.g., "Water_Cleanliness", "Air_Quality")

Key Interaction with the Central Core:

Sends: This ring constantly sends a stream of data to the core, including the status of medical facilities, the progress of research projects, and all environmental data points.

Receives: It receives high-level goals from the core, such as "prioritize medical R&D" or "increase CAD-CAM capacity."

Second Ring (Habitation)
This is the residential area. While people live here, the focus for our prototype is on tracking the needs and well-being of the population, not individuals. This is where we'll track the "user-facing" systems.

Proposed Variables:

Current_Housing_Occupancy (Float percentage)

Average_Wellbeing_Index (Float - an abstract score based on access to resources, leisure, etc.)

Climate_Control_Status (Map: String -> Float or Boolean for each zone)

Leisure_Resource_Utilization (Map: String -> Float, e.g., "Park_Usage", "Library_Utilization")

Key Interaction with the Central Core:

Sends: It sends data on population, resource consumption trends, and requests for new recreational or residential infrastructure.

Receives: It receives commands to adjust climate controls or to distribute specific resources (like water) to different zones.

Third Ring (Food Production)
This ring is all about feeding the city. Its variables will track the efficiency of automated food systems.

Proposed Variables:

Farm_Efficiency (Float between 0.0 and 1.0)

Water_Recycled_Percentage (Float)

Power_Consumption_Rate (Float)

Food_Output_Rate (Float)

Key Interaction with the Central Core:

Sends: It sends real-time data on food output, resource consumption, and any system failures.

Receives: It receives direct commands from the core, such as "increase production for crop X" or "reduce power consumption during off-peak hours."

Outer Ring (Production & Reclamation)
This ring is responsible for the physical goods of the city. We'll track manufacturing and the critical process of recycling.

Proposed Variables:

Manufacturing_Output_Rate (Float)

Material_Reclamation_Rate (Float)

Waste_Volume (Float)

Active_CADCAM_Production (Array of Strings)

Key Interaction with the Central Core:

Sends: It reports on the inventory of manufactured goods and the rate of waste reclamation.

Receives: It receives production orders from the core based on city-wide demand. For example, "produce 100 transportation modules" or "prioritize recycling of plastic materials."
