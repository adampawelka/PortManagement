// tests/unit/services/OperationPlanService.spec.ts

import { OperationPlanService } from "../../../src/services/OperationPlanService";
import { IOperationPlanRepo } from "../../../src/services/IRepos/IOperationPlanRepo";
import { CreateOperationPlanDTO, ScheduledOperationDTO } from "../../../src/dto/OperationPlanDTO";
import { OperationPlan } from "../../../src/Domain/OperationPlans/OperationPlan";
import { OperationPlanId } from "../../../src/Domain/OperationPlans/OperationPlanId";
import { UniqueEntityID } from "../../../src/core/domain/UniqueEntityID";
import { expect } from "chai";
import { beforeEach, describe, it } from "node:test";

describe("OperationPlanService", () => {
  let service: OperationPlanService;
  let mockRepo: jest.Mocked<IOperationPlanRepo>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByVvnId: jest.fn(),
      findAll: jest.fn(),
      findAllByVvnId: jest.fn(),
      search: jest.fn(),
      exists: jest.fn(),
    } as any;

    service = new OperationPlanService(mockRepo);
  });

  describe("savePlans", () => {
    const mockUserId = "user-123";
    const mockAlgorithm = "optimal";
    const mockDate = new Date("2025-01-15");

    const mockSchedule: ScheduledOperationDTO[] = [
      {
        vesselName: "Test Vessel",
        start: new Date("2025-01-15T08:00:00"),
        end: new Date("2025-01-15T12:00:00"),
        delay: 0,
        dock: "Dock A",
        cranes: ["Crane-1"],
        staff: ["Staff-1"]
      }
    ];

    const mockPlans: CreateOperationPlanDTO[] = [
      {
        vvnId: "vvn-123",
        createdAt: mockDate,
        createdBy: mockUserId,
        algorithmUsed: mockAlgorithm,
        schedule: mockSchedule
      },
      {
        vvnId: "vvn-456",
        createdAt: mockDate,
        createdBy: mockUserId,
        algorithmUsed: mockAlgorithm,
        schedule: mockSchedule
      }
    ];

    const mockMetadata = {
      algorithmUsed: mockAlgorithm,
      createdBy: mockUserId
    };

    it("should save multiple plans successfully", async () => {
      mockRepo.save = jest.fn().mockResolvedValue(undefined);

      const result = await (service as any).savePlans(mockPlans, mockMetadata);

      expect(mockRepo.save).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0].vvnId).toBe("vvn-123");
      expect(result[1].vvnId).toBe("vvn-456");
    });

    it("should add metadata to plans when not provided", async () => {
      const incompletePlans: CreateOperationPlanDTO[] = [
        {
          vvnId: "vvn-123",
          createdAt: undefined as any,
          createdBy: "",
          algorithmUsed: "",
          schedule: mockSchedule
        }
      ];

      mockRepo.save = jest.fn().mockResolvedValue(undefined);

      await (service as any).savePlans(incompletePlans, mockMetadata);

      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({
            createdBy: { value: mockUserId },
            algorithmUsed: { value: mockAlgorithm },
            createdAt: { value: expect.any(Date) }
          })
        })
      );
    });

    it("should skip failed plans and continue with others", async () => {
      const badSchedule: ScheduledOperationDTO[] = [
        {
          vesselName: "", // Invalid: empty vessel name
          start: new Date(),
          end: new Date(),
          delay: 0,
          dock: "Dock A",
          cranes: [],
          staff: []
        }
      ];

      const plansWithOneBad: CreateOperationPlanDTO[] = [
        {
          vvnId: "vvn-good",
          createdAt: mockDate,
          createdBy: mockUserId,
          algorithmUsed: mockAlgorithm,
          schedule: mockSchedule
        },
        {
          vvnId: "vvn-bad",
          createdAt: mockDate,
          createdBy: mockUserId,
          algorithmUsed: mockAlgorithm,
          schedule: badSchedule // Will fail creation
        }
      ];

      mockRepo.save = jest.fn().mockResolvedValue(undefined);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await (service as any).savePlans(plansWithOneBad, mockMetadata);

      expect(mockRepo.save).toHaveBeenCalledTimes(1); // Only the good one
      expect(result).toHaveLength(1);
      expect(result[0].vvnId).toBe("vvn-good");
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to create plan for VVN vvn-bad")
      );

      consoleSpy.mockRestore();
    });

    it("should return empty array when all plans fail", async () => {
      const badPlans: CreateOperationPlanDTO[] = [
        {
          vvnId: "vvn-bad",
          createdAt: mockDate,
          createdBy: mockUserId,
          algorithmUsed: mockAlgorithm,
          schedule: [] // Empty schedule will fail validation
        }
      ];

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await (service as any).savePlans(badPlans, mockMetadata);

      expect(mockRepo.save).not.toHaveBeenCalled();
      expect(result).toHaveLength(0);
      
      consoleSpy.mockRestore();
    });
  });

  describe("search", () => {
    it("should search plans with date filters", async () => {
      const mockPlan = OperationPlan.create({
        vvnId: { value: "vvn-123" } as any,
        createdAt: { value: new Date("2025-01-15") } as any,
        createdBy: { value: "user-123" } as any,
        algorithmUsed: { value: "optimal" } as any,
        schedule: [] as any
      }, new UniqueEntityID()).getValue();

      mockRepo.search = jest.fn().mockResolvedValue([mockPlan]);

      const searchDTO = {
        dateStart: new Date("2025-01-01"),
        dateEnd: new Date("2025-01-31"),
        vesselName: "Test Vessel"
      };

      const result = await service.search(searchDTO);

      expect(mockRepo.search).toHaveBeenCalledWith(searchDTO);
      expect(result).toHaveLength(1);
    });

    it("should sort results by start time", async () => {
      const earlyPlan = OperationPlan.create({
        vvnId: { value: "vvn-early" } as any,
        createdAt: { value: new Date("2025-01-15") } as any,
        createdBy: { value: "user" } as any,
        algorithmUsed: { value: "optimal" } as any,
        schedule: [
          {
            vesselName: "Vessel A",
            start: new Date("2025-01-15T08:00:00"),
            end: new Date("2025-01-15T10:00:00"),
            delay: 0,
            dock: "Dock A",
            cranes: [],
            staff: []
          }
        ] as any
      }, new UniqueEntityID()).getValue();

      const latePlan = OperationPlan.create({
        vvnId: { value: "vvn-late" } as any,
        createdAt: { value: new Date("2025-01-15") } as any,
        createdBy: { value: "user" } as any,
        algorithmUsed: { value: "optimal" } as any,
        schedule: [
          {
            vesselName: "Vessel B",
            start: new Date("2025-01-15T12:00:00"),
            end: new Date("2025-01-15T14:00:00"),
            delay: 0,
            dock: "Dock A",
            cranes: [],
            staff: []
          }
        ] as any
      }, new UniqueEntityID()).getValue();

      mockRepo.search = jest.fn().mockResolvedValue([latePlan, earlyPlan]);

      const searchDTO = {
        sortBy: 'startTime' as const,
        sortOrder: 'asc' as const
      };

      const result = await service.search(searchDTO);

      expect(result[0].schedule[0].start.getTime()).toBeLessThan(
        result[1].schedule[0].start.getTime()
      );
    });
  });
});