using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Policy;


namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPBuildingControlChecklistController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPBuildingControlChecklistController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateBuildingControlChecklistItem")]
        public async Task<object> AddUpdateBuildingControlChecklistItem([FromBody] BPBuildingControlChecklistBindingModel model)
        {
            try
            {
                var result = new object();

                if (model.FunctionalArea == null || model.ChecklistItem == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if (model.BuildingControlChecklistID == 0)
                    {
                        model.BuildingControlChecklistID = null;
                    }

                    var tempBuildingControlChecklistItem = _context.BPBuildingControlChecklist.FirstOrDefault(x => x.BuildingControlChecklistID == model.BuildingControlChecklistID);

                    if (tempBuildingControlChecklistItem == null)
                    {
                        tempBuildingControlChecklistItem = new BPBuildingControlChecklist()
                        {
                            FunctionalArea = model.FunctionalArea,
                            ChecklistItem = model.ChecklistItem,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true

                        };

                        await _context.BPBuildingControlChecklist.AddAsync(tempBuildingControlChecklistItem);
                        await _context.SaveChangesAsync();

                        result = tempBuildingControlChecklistItem;
                    }
                    else
                    {
                        if (model.FunctionalArea.Trim() != null)
                        {
                            tempBuildingControlChecklistItem.FunctionalArea = model.FunctionalArea;
                        }

                        if (model.ChecklistItem.Trim() != null)
                        {
                            tempBuildingControlChecklistItem.ChecklistItem = model.ChecklistItem;
                        }

                        tempBuildingControlChecklistItem.DateUpdated = DateTime.Now;
                        _context.Update(tempBuildingControlChecklistItem);
                        await _context.SaveChangesAsync();
                        result = tempBuildingControlChecklistItem;

                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.BuildingControlChecklistID> 0 ? "Building Control Checklist Item Updated Successfully" : "Building Control Checklist Item Created Successfully"), result));

                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteBuildingControlChecklistItem")]
        public async Task<object> DeleteBuildingControlChecklistItem([FromBody] BPBuildingControlChecklistBindingModel model)
        {
            try
            {
                if (model.BuildingControlChecklistID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing ", null)); 
                }
                else
                {
                    var tempBuildingControlChecklistItem = _context.BPBuildingControlChecklist.FirstOrDefault(x => x.BuildingControlChecklistID == model.BuildingControlChecklistID);

                    if(tempBuildingControlChecklistItem == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could not find entry in database", false));
                    }
                    else
                    {
                        tempBuildingControlChecklistItem.isActive = false;
                        tempBuildingControlChecklistItem.DateUpdated = DateTime.Now;

                        _context.Update(tempBuildingControlChecklistItem);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Building Control Checklist Item deleted successfully", true));
                    }
                }
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetAllChecklistItemsForFunctionalArea")]
        public async Task<object> GetAllChecklistItemsForFunctionalArea([FromBody] BPBuildingControlChecklistBindingModel model)
        {
            try
            {
                if(model.FunctionalArea == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing",null));
                }
                else
                {
                    var result = await (from checklistItem in _context.BPBuildingControlChecklist
                                        where checklistItem.FunctionalArea == model.FunctionalArea && checklistItem.isActive == true
                                        select new BPBuildingControlChecklistDTO()
                                        {
                                            BuildingControlChecklistID = checklistItem.BuildingControlChecklistID,
                                            FunctionalArea = checklistItem.FunctionalArea,
                                            ChecklistItem = checklistItem.ChecklistItem,
                                            CreatedById = checklistItem.CreatedById,
                                            DateCreated = checklistItem.DateCreated,
                                            DateUpdated = checklistItem.DateUpdated,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Building Control Items For Functional Area", result));

                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetChecklistItemByBuildingControlChecklistID")]
        public async Task<object> GetChecklistItemByBuildingControlChecklistID([FromBody] BPBuildingControlChecklistBindingModel model)
        {
            try
            {
                if(model.BuildingControlChecklistID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from checklistItem in _context.BPBuildingControlChecklist
                                        where checklistItem.BuildingControlChecklistID == model.BuildingControlChecklistID && checklistItem.isActive == true
                                        select new BPBuildingControlChecklistDTO()
                                        {
                                            BuildingControlChecklistID = checklistItem.BuildingControlChecklistID,
                                            FunctionalArea = checklistItem.FunctionalArea,
                                            ChecklistItem = checklistItem.ChecklistItem,
                                            CreatedById = checklistItem.CreatedById,
                                            DateCreated = checklistItem.DateCreated,
                                            DateUpdated = checklistItem.DateUpdated,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Checklist item by BuildingControlChecklistID", result));
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));

            }
        }

        [HttpGet("GetAllBuildingControlChecklistItems")]
        public async Task<object> GetAllBuildingControlChecklistItems()
        {
            try
            {
                var result = await (from checklistItem in _context.BPBuildingControlChecklist
                                    where checklistItem.isActive == true
                                    select new BPBuildingControlChecklistDTO()
                                    {
                                        BuildingControlChecklistID = checklistItem.BuildingControlChecklistID,
                                        FunctionalArea = checklistItem.FunctionalArea,
                                        ChecklistItem = checklistItem.ChecklistItem,
                                        CreatedById = checklistItem.CreatedById,
                                        DateCreated = checklistItem.DateCreated,
                                        DateUpdated = checklistItem.DateUpdated,

                                    }).ToListAsync();

                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got all building control checklist items", result));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
  
