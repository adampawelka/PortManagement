
import { OperationPlanController } from "../../../src/controllers/IControllers/OperationPlanController";
import { IOperationPlanService } from "../../../src/services/IServices/IOperationPlanService";
import { CreateOperationPlanDTO } from "../../../src/dto/OperationPlanDTO";
import { describe, it } from "node:test";
import { expect } from "chai";

describe("OperationPlanController", () => {
  let controller: OperationPlanController;
  let mockService: jest.Mocked<IOperationPlanService>;

  const mockRequest = (body: any = {}, params: any = {}, query: any = {}) => ({
    body,
    params,
    query,
    headers: {}
  } as any);

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  beforeEach(() => {
    mockService = {
      create: jest.fn(),
      getById: jest.fn(),
      getByVvnId: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      search: jest.fn(),
    } as any;

    controller = new OperationPlanController(mockService);
  });

  describe("createBatchOperationPlans", () => {
    it("should save batch of plans successfully", async () => {
      const req = mockRequest({
        plans: [
          { vvnId: "vvn-1", schedule: [], algorithmUsed: "optimal", createdBy: "user" },
          { vvnId: "vvn-2", schedule: [], algorithmUsed: "optimal", createdBy: "user" }
        ],
        metadata: { algorithmUsed: "optimal", createdBy: "system" }
      });
      const res = mockResponse();

      mockService.create
        .mockResolvedValueOnce({ id: "1", vvnId: "vvn-1" } as any)
        .mockResolvedValueOnce({ id: "2", vvnId: "vvn-2" } as any);

      await (controller as any).createBatchOperationPlans(req, res, mockNext);

      expect(mockService.create).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully saved 2 operation plans",
        count: 2,
        plans: expect.any(Array)
      });
    });

    it("should return 400 for empty plans array", async () => {
      const req = mockRequest({ plans: [] });
      const res = mockResponse();

      await (controller as any).createBatchOperationPlans(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Plans array is required and cannot be empty"
      });
    });

    it("should handle service errors gracefully", async () => {
      const req = mockRequest({
        plans: [{ vvnId: "vvn-1", schedule: [] }],
        metadata: {}
      });
      const res = mockResponse();

      mockService.create.mockRejectedValue(new Error("Database error"));

      await (controller as any).createBatchOperationPlans(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should enhance plans with metadata", async () => {
      const req = mockRequest({
        plans: [
          { vvnId: "vvn-1", schedule: [] } // Missing metadata fields
        ],
        metadata: {
          algorithmUsed: "optimal",
          createdBy: "system"
        }
      });
      const res = mockResponse();

      mockService.create.mockResolvedValue({ id: "1" } as any);

      await (controller as any).createBatchOperationPlans(req, res, mockNext);

      expect(mockService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          algorithmUsed: "optimal",
          createdBy: "system",
          createdAt: expect.any(Date)
        })
      );
    });
  });

  describe("search", () => {
    it("should parse query parameters correctly", async () => {
      const req = mockRequest({}, {}, {
        dateStart: "2025-01-01",
        dateEnd: "2025-01-31",
        vesselName: "Aurora",
        sortBy: "startTime",
        sortOrder: "desc"
      });
      const res = mockResponse();

      mockService.search.mockResolvedValue([]);

      await controller.search(req, res, mockNext);

      expect(mockService.search).toHaveBeenCalledWith(
        expect.objectContaining({
          dateStart: expect.any(Date),
          dateEnd: expect.any(Date),
          vesselName: "Aurora",
          sortBy: "startTime",
          sortOrder: "desc"
        })
      );
    });

    it("should handle missing query parameters", async () => {
      const req = mockRequest({}, {}, {});
      const res = mockResponse();

      mockService.search.mockResolvedValue([]);

      await controller.search(req, res, mockNext);

      expect(mockService.search).toHaveBeenCalledWith(
        expect.objectContaining({
          dateStart: undefined,
          dateEnd: undefined,
          sortOrder: "asc"
        })
      );
    });
  });
});