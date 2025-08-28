// FoodProductionSubsystem.h

#pragma once

#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "FoodProductionSubsystem.generated.h"

// Enum to define the state of the food production system
UENUM(BlueprintType)
enum class ESystemStatus : uint8
{
    Offline         UMETA(DisplayName = "Offline"),
    Initializing    UMETA(DisplayName = "Initializing"),
    Operational     UMETA(DisplayName = "Operational"),
    Warning         UMETA(DisplayName = "Warning"),
    Critical        UMETA(DisplayName = "Critical")
};

// Struct to represent a single crop plot or item
USTRUCT(BlueprintType)
struct FHarvestableCrop
{
    GENERATED_BODY()

    // Current growth stage (e.g., Seed, Sprout, Mature)
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Crop")
    int32 GrowthStage = 0;

    // Current growth progress, from 0.0 to 1.0
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Crop")
    float GrowthProgress = 0.0f;

    // Is the crop ready for harvest?
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Crop")
    bool bIsReadyToHarvest = false;
};

// The main C++ class for the Food Production system.
UCLASS(Blueprintable)
class RBE_CITY_TVP_API UFoodProductionSubsystem : public UGameInstanceSubsystem
{
    GENERATED_BODY()

public:
    // This is the constructor for the subsystem.
    UFoodProductionSubsystem();

    // The core initialization function for the subsystem.
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;

    // The main update function, called every frame.
    virtual void Deinitialize() override;

    // Public function to get the current food supply.
    UFUNCTION(BlueprintPure, Category = "FoodProduction")
    float GetFoodSupply() const;

    // Public function to get the current system status.
    UFUNCTION(BlueprintPure, Category = "FoodProduction")
    ESystemStatus GetSystemStatus() const;

protected:
    // Protected variables, visible to derived classes.

    // A timer handle to manage the growth update function.
    FTimerHandle GrowthUpdateTimer;

    // An array to hold all the individual crops in the simulation.
    UPROPERTY(BlueprintReadOnly, Category = "FoodProduction")
    TArray<FHarvestableCrop> Crops;

    // The current total food supply in metric tons.
    UPROPERTY(BlueprintReadOnly, Category = "FoodProduction")
    float FoodSupply;

    // The current status of the system.
    UPROPERTY(BlueprintReadOnly, Category = "FoodProduction")
    ESystemStatus SystemStatus;

    // The amount of time (in seconds) it takes for a crop to grow.
    UPROPERTY(EditDefaultsOnly, Category = "FoodProduction")
    float TimeToGrow;

    // The amount of food (in kg) that a single crop provides.
    UPROPERTY(EditDefaultsOnly, Category = "FoodProduction")
    float YieldPerCrop;

    // The number of crops to simulate.
    UPROPERTY(EditDefaultsOnly, Category = "FoodProduction")
    int32 NumberOfCrops;

    // Protected functions for internal use.

    // Function to handle the growth update logic.
    void OnGrowthUpdate();

    // Simulates the growth of all crops.
    void SimulateGrowth(float DeltaTime);

    // Harvests all crops that are ready.
    void HarvestReadyCrops();
};


