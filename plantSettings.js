export var PLANT_TYPES = {
    BERRY: {
        name: "Strawberry Bush",
        icon: "🍓",
        points: 8,
        energyCost: 5,
        harvestType: 'produce',
        productionInterval: 15,
        waterInterval: 30,
        waterDepletionRate: 0.5,
        maxWaterLevel: 100,
        stages: [
            {
                duration: 5,
                color: 0x556b2f,
                height: 0.2,
                radius: 0.1
            },
            {
                duration: 8,
                color: 0x6b8e23,
                height: 0.5,
                radius: 0.15
            },
            {
                duration: Infinity,
                color: 0x228b22,
                height: 0.7,
                radius: 0.2,
                topperType: 'sphere',
                topperRadius: 0.15,
                topperColor: 0xdc143c,
                glowColor: 0xff4500
            }
        ]
    },
    SUNFLOWER: {
        name: "Sunflower",
        icon: "🌻",
        points: 25,
        energyCost: 15,
        harvestType: 'consume',
        waterInterval: 45,
        waterDepletionRate: 0.4,
        maxWaterLevel: 120,
        stages: [
            {
                duration: 7,
                color: 0x8FBC8F,
                height: 0.3,
                radius: 0.12
            },
            {
                duration: 12,
                color: 0x556B2F,
                height: 1.0,
                radius: 0.1
            },
            {
                duration: Infinity,
                color: 0x2E8B57,
                height: 1.2,
                radius: 0.15,
                topperType: 'sphere',
                topperRadius: 0.3,
                topperColor: 0xFFD700,
                glowColor: 0xFFA500
            }
        ]
    },
    BLACKBERRY: {
        name: "Blackberry Bush",
        icon: "🍇",
        points: 10,
        energyCost: 7,
        harvestType: 'produce',
        productionInterval: 18,
        waterInterval: 35,
        waterDepletionRate: 0.45,
        maxWaterLevel: 100,
        stages: [
            {
                duration: 6,
                color: 0x4F7942,
                height: 0.25,
                radius: 0.11
            },
            {
                duration: 9,
                color: 0x355E3B,
                height: 0.55,
                radius: 0.16
            },
            {
                duration: Infinity,
                color: 0x004225,
                height: 0.75,
                radius: 0.22,
                topperType: 'sphere',
                topperRadius: 0.12,
                topperColor: 0x2C001E,
                glowColor: 0x4B0082
            }
        ]
    },
    HAZELNUT: {
        name: "Hazelnut Tree",
        icon: "🌰",
        points: 15,
        energyCost: 12,
        harvestType: 'produce',
        productionInterval: 20,
        waterInterval: 50,
        waterDepletionRate: 0.3,
        maxWaterLevel: 150,
        stages: [
            {
                duration: 10,
                color: 0x8FBC8F,
                height: 0.4,
                radius: 0.15
            },
            {
                duration: 15,
                color: 0x556B2F,
                height: 1.2,
                radius: 0.2
            },
            {
                duration: Infinity,
                color: 0x8B4513,
                height: 2.0,
                radius: 0.3,
                topperType: 'sphere',
                topperRadius: 0.6,
                topperColor: 0x228B22,
                glowColor: 0xD2B48C
            }
        ]
    },
    PERSIMMON: {
        name: "Persimmon Tree",
        icon: "🍊",
        points: 20,
        energyCost: 18,
        harvestType: 'produce',
        productionInterval: 25,
        waterInterval: 60,
        waterDepletionRate: 0.25,
        maxWaterLevel: 160,
        stages: [
            {
                duration: 12,
                color: 0x90EE90,
                height: 0.35,
                radius: 0.14
            },
            {
                duration: 18,
                color: 0x3CB371,
                height: 1.4,
                radius: 0.22
            },
            {
                duration: Infinity,
                color: 0xA0522D,
                height: 2.2,
                radius: 0.35,
                topperType: 'sphere',
                topperRadius: 0.25,
                topperColor: 0xFFB347,
                glowColor: 0xFFA500
            }
        ]
    },
    PAWPAW: {
        name: "Paw Paw Tree",
        icon: "🥭",
        points: 18,
        energyCost: 16,
        harvestType: 'produce',
        productionInterval: 22,
        waterInterval: 55,
        waterDepletionRate: 0.3,
        maxWaterLevel: 140,
        stages: [
            {
                duration: 9,
                color: 0x98FB98,
                height: 0.3,
                radius: 0.13
            },
            {
                duration: 14,
                color: 0x32CD32,
                height: 1.3,
                radius: 0.18
            },
            {
                duration: Infinity,
                color: 0x8B4513,
                height: 1.8,
                radius: 0.28,
                topperType: 'sphere',
                topperRadius: 0.3,
                topperColor: 0xFFF700,
                glowColor: 0xADFF2F
            }
        ]
    },
    MUSCADINE_GRAPE: {
        name: "Muscadine Grape Vine",
        icon: "🍇",
        points: 12,
        energyCost: 8,
        harvestType: 'produce',
        productionInterval: 16,
        waterInterval: 32,
        waterDepletionRate: 0.5,
        maxWaterLevel: 90,
        stages: [
            {
                duration: 6,
                color: 0x6B8E23,
                height: 0.2,
                radius: 0.08
            },
            {
                duration: 10,
                color: 0x556B2F,
                height: 0.6,
                radius: 0.12
            },
            {
                duration: Infinity,
                color: 0x2E8B57,
                height: 0.8,
                radius: 0.18,
                topperType: 'sphere',
                topperRadius: 0.15,
                topperColor: 0x4B0082,
                glowColor: 0x8A2BE2
            }
        ]
    },
    ELDERBERRY: {
        name: "Elderberry Bush",
        icon: "🫐",
        points: 9,
        energyCost: 6,
        harvestType: 'produce',
        productionInterval: 14,
        waterInterval: 28,
        waterDepletionRate: 0.6,
        maxWaterLevel: 80,
        stages: [
            {
                duration: 5,
                color: 0x8FBC8F,
                height: 0.25,
                radius: 0.1
            },
            {
                duration: 8,
                color: 0x228B22,
                height: 0.5,
                radius: 0.15
            },
            {
                duration: Infinity,
                color: 0x006400,
                height: 0.7,
                radius: 0.2,
                topperType: 'sphere',
                topperRadius: 0.1,
                topperColor: 0x1A1110,
                glowColor: 0x2F4F4F
            }
        ]
    },
    PEAR_TREE: {
        name: "Pear Tree",
        icon: "🍐",
        points: 22,
        energyCost: 20,
        harvestType: 'produce',
        productionInterval: 28,
        waterInterval: 65,
        waterDepletionRate: 0.2,
        maxWaterLevel: 180,
        stages: [
            {
                duration: 13,
                color: 0x90EE90,
                height: 0.4,
                radius: 0.15
            },
            {
                duration: 20,
                color: 0x3CB371,
                height: 1.5,
                radius: 0.25
            },
            {
                duration: Infinity,
                color: 0xA0522D,
                height: 2.3,
                radius: 0.38,
                topperType: 'sphere',
                topperRadius: 0.28,
                topperColor: 0xADFF2F,
                glowColor: 0xDAA520
            }
        ]
    },
    CALENDULA: {
        name: "Calendula",
        icon: "🌼",
        points: 15,
        energyCost: 10,
        harvestType: 'consume',
        allowMultiplePerPlot: true,
        maxPlantsPerPlot: 4,
        canSpread: true,
        spreadInterval: 20,
        waterInterval: 25,
        waterDepletionRate: 0.7,
        maxWaterLevel: 70,
        stages: [
            {
                duration: 4,
                color: 0x90EE90,
                height: 0.15,
                radius: 0.07
            },
            {
                duration: 7,
                color: 0x3CB371,
                height: 0.3,
                radius: 0.1
            },
            {
                duration: Infinity,
                color: 0x228B22,
                height: 0.4,
                radius: 0.12,
                topperType: 'sphere',
                topperRadius: 0.15,
                topperColor: 0xFFA500,
                glowColor: 0xFFD700
            }
        ]
    },
    OREGANO: {
        name: "Oregano",
        icon: "🌿",
        points: 7,
        energyCost: 4,
        harvestType: 'consume',
        allowMultiplePerPlot: true,
        maxPlantsPerPlot: 5,
        canSpread: true,
        spreadInterval: 18,
        waterInterval: 20,
        waterDepletionRate: 0.8,
        maxWaterLevel: 60,
        stages: [
            {
                duration: 3,
                color: 0x98FB98,
                height: 0.1,
                radius: 0.05
            },
            {
                duration: 6,
                color: 0x556B2F,
                height: 0.2,
                radius: 0.08
            },
            {
                duration: Infinity,
                color: 0x6B8E23,
                height: 0.25,
                radius: 0.15,
                topperType: 'sphere',
                topperRadius: 0.05,
                topperColor: 0xE6E6FA,
                glowColor: 0x9370DB
            }
        ]
    },
    MINT: {
        name: "Mint",
        icon: "🍃",
        points: 9,
        energyCost: 3,
        harvestType: 'consume',
        allowMultiplePerPlot: true,
        maxPlantsPerPlot: 3,
        canSpread: true,
        spreadInterval: 15,
        waterInterval: 18,
        waterDepletionRate: 1.0,
        maxWaterLevel: 50,
        stages: [
            {
                duration: 3,
                color: 0xAFEEEE,
                height: 0.12,
                radius: 0.06
            },
            {
                duration: 5,
                color: 0x40E0D0,
                height: 0.25,
                radius: 0.09
            },
            {
                duration: Infinity,
                color: 0x008080,
                height: 0.35,
                radius: 0.18,
                glowColor: 0x48D1CC
            }
        ]
    },
    CLOVER: {
        name: "Clover",
        icon: "🍀",
        points: 5,
        energyCost: 2,
        harvestType: 'consume',
        allowMultiplePerPlot: true,
        maxPlantsPerPlot: 6,
        canSpread: true,
        spreadInterval: 22,
        waterInterval: 26,
        waterDepletionRate: 0.65,
        maxWaterLevel: 75,
        stages: [
            {
                duration: 2,
                color: 0x98FB98,
                height: 0.05,
                radius: 0.04
            },
            {
                duration: 4,
                color: 0x32CD32,
                height: 0.1,
                radius: 0.1
            },
            {
                duration: Infinity,
                color: 0x228B22,
                height: 0.15,
                radius: 0.15,
                topperType: 'sphere',
                topperRadius: 0.08,
                topperColor: 0xFFF0F5,
                glowColor: 0xFFC0CB
            }
        ]
    }
};
