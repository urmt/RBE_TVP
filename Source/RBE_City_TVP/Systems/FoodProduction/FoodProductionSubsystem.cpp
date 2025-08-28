// FoodProductionSubsystem.cpp

#include "FoodProductionSubsystem.h"

UFoodProductionSubsystem::UFoodProductionSubsystem()
    : FoodSupply(0.0f)
    , SystemStatus(ESystemStatus::Offline)
    , TimeToGrow(60.0f) // Example: 60 seconds per crop
    , YieldPerCrop(1.0f) // Example: 1kg per crop
    , NumberOfCrops(100)
{
}

void UFoodProductionSubsystem::Initialize(FSubsystemCollectionBase& Collection)
{
    Super::Initialize(Collection);

    // Initialize the system and set initial status.
    SystemStatus = ESystemStatus::Initializing;

    // Set up the initial array of crops.
    Crops.Empty();
    for (int i = 0; i < NumberOfCrops; ++i)
    {
        Crops.Add(FHarvestableCrop());
    }

    // Set a timer to periodically update the growth status of crops.
    FTimerManager& TimerManager = GetWorld()->GetTimerManager();
    TimerManager.SetTimer(GrowthUpdateTimer, this, &UFoodProductionSubsystem::OnGrowthUpdate, 1.0f, true);

    // Set the system to operational after a brief delay.
    SystemStatus = ESystemStatus::Operational;
}

void UFoodProductionSubsystem::Deinitialize()
{
    // Clean up timers and other resources.
    if (UWorld* World = GetWorld())
    {
        World->GetTimerManager().ClearTimer(GrowthUpdateTimer);
    }
    Super::Deinitialize();
}

void UFoodProductionSubsystem::OnGrowthUpdate()
{
    // Iterate through all crops and update their growth.
    for (FHarvestableCrop& Crop : Crops)
    {
        if (!Crop.bIsReadyToHarvest)
        {
            // Increase growth progress.
            Crop.GrowthProgress += (1.0f / TimeToGrow);

            // Check if a new growth stage has been reached.
            if (Crop.GrowthProgress >= 1.0f)
            {
                Crop.GrowthProgress = 1.0f;
                Crop.bIsReadyToHarvest = true;
            }
        }
    }
    HarvestReadyCrops();
}

void UFoodProductionSubsystem::HarvestReadyCrops()
{
    for (FHarvestableCrop& Crop : Crops)
    {
        if (Crop.bIsReadyToHarvest)
        {
            // Add the yield to the total food supply.
            FoodSupply += YieldPerCrop;

            // Reset the crop for a new growth cycle.
            Crop.GrowthStage = 0;
            Crop.GrowthProgress = 0.0f;
            Crop.bIsReadyToHarvest = false;
        }
    }
}

float UFoodProductionSubsystem::GetFoodSupply() const
{
    return FoodSupply;
}

ESystemStatus UFoodProductionSubsystem::GetSystemStatus() const
{
    return SystemStatus;
}
