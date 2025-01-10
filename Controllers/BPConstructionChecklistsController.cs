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
    public class BPConstructionChecklistsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public BPConstructionChecklistsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateConstructionChecklist")]
        public async Task<object> AddUpdateConstructionChecklist([FromBody] BPConstructionChecklistsBindingModel model)
        {
            try
            {
                var result = new object();

                if(model.ApplicationID == null || model.ChecklistItem == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if(model.ApplicationID == 0 )
                    {
                        model.ApplicationID = null; 
                    }

                    var tempConstructionChecklist = _context.BPConstructionChecklists.FirstOrDefault(x => x.ConstructionChecklistID == model.ConstructionChecklistID);

                    if(tempConstructionChecklist == null)
                    {
                        tempConstructionChecklist = new BPConstructionChecklists()
                        {
                            ApplicationID = model.ApplicationID , 
                            ChecklistItem = model.ChecklistItem,
                            IsChecked = model.IsChecked,
                            isApplicable = model.isApplicable,
                            CreatedById = model.CreatedById, 
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true 
                        };

                        await _context.BPConstructionChecklists.AddAsync(tempConstructionChecklist);
                        await _context.SaveChangesAsync();

                        result = tempConstructionChecklist;

                    }
                    else
                    {
                        if(model.IsChecked != null)
                        {
                            tempConstructionChecklist.IsChecked = model.IsChecked;
                        }

                         if(model.isApplicable != null)
                        {
                            tempConstructionChecklist.isApplicable = model.isApplicable;
                        }

                         tempConstructionChecklist.DateUpdated = DateTime.Now;

                        _context.Update(tempConstructionChecklist);
                        await _context.SaveChangesAsync(); 
                        
                        result = tempConstructionChecklist;
                    }

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.ConstructionChecklistID > 0 ? "Construction Checklist Item Updated Successfully" : "Construction Checklist Item Created Successfully"), result));
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("GetConstructionChecklistByApplicationID")]
        public async Task<object> GetContructionChecklistByApplicationID([FromBody] BPConstructionChecklistsBindingModel model )
        {
            try
            {
                if(model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing ", null));
                }
                else
                {
                    var result = await (from checklist in _context.BPConstructionChecklists
                                        where checklist.ApplicationID == model.ApplicationID && checklist.isActive == true
                                        select new BPConstructionChecklistsDTO()
                                        {
                                            ConstructionChecklistID = checklist.ConstructionChecklistID,
                                            ApplicationID = checklist.ApplicationID,
                                            ChecklistItem = checklist.ChecklistItem,
                                            IsChecked = checklist.IsChecked,
                                            isApplicable = checklist.isApplicable,
                                            CreatedById = checklist.CreatedById,
                                            DateCreated = checklist.DateCreated,
                                            DateUpdated = checklist.DateUpdated,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got Construction checklist for application", result));
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("ChangeChecklistItemStatus")]
        public async Task<object> ChangeChecklistItemStatus([FromBody] BPConstructionChecklistsBindingModel model)
        {
            try
            {
                var result = new object(); 

                if(model.ConstructionChecklistID ==  null || model.ConstructionChecklistID == 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempChecklistItem = _context.BPConstructionChecklists.FirstOrDefault(x => x.ConstructionChecklistID == model.ConstructionChecklistID);

                    if(tempChecklistItem == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Error finding data in database", null));
                    }
                    else
                    {

                        tempChecklistItem.IsChecked = model.IsChecked;
                        tempChecklistItem.isApplicable = model.isApplicable;
                        tempChecklistItem.DateUpdated = DateTime.Now;

                        _context.Update(tempChecklistItem);
                        await _context.SaveChangesAsync();

                        result = tempChecklistItem;

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Checklist Item Changed Successfully", result)); 
                    }
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteConstructionChecklistItem")]
        public async Task<object> DeleteConstructionChecklistItem([FromBody] BPConstructionChecklistsBindingModel model)
        {
            try
            {
                if(model.ConstructionChecklistID == null){

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempChecklistItem = _context.BPConstructionChecklists.FirstOrDefault(x => x.ConstructionChecklistID == model.ConstructionChecklistID); 

                    if(tempChecklistItem == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could not entry in database", false)); 
                    }
                    else
                    {
                        tempChecklistItem.isActive = false;
                        tempChecklistItem.DateUpdated = DateTime.Now;

                        _context.Update(tempChecklistItem);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Construction Checklist Item Delete successfully", true));
                    }
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("AddAllChecklistItemsToApplication")]
        public async Task<object> AddAllChecklistItemsToApplication([FromBody] BPConstructionChecklistsBindingModel model)
        {
            try
            {
                if(model.ApplicationID == null || model.ConstructionChecklistID != 0)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {

                    model.ConstructionChecklistID = null; 

                    var checklistItems = _context.BPBuildingControlChecklist.Where(x => x.FunctionalArea == "Building Plan" && x.isActive == true).ToList();

                    var newEntries = new List<BPConstructionChecklists>();

                    foreach ( var tempChecklist in checklistItems)
                    {
                        var tempConstructionChecklist = new BPConstructionChecklists()
                        {
                            ApplicationID = model.ApplicationID,
                            ChecklistItem = tempChecklist.ChecklistItem,
                            IsChecked = null, 
                            isApplicable = null, 
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            CreatedById = model.CreatedById,
                            isActive = true 
                        };
                        newEntries.Add(tempConstructionChecklist); 
                        await _context.BPConstructionChecklists.AddAsync(tempConstructionChecklist);
                      
                    }

                    await _context.SaveChangesAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Construction Checklist Added SuccessFully", newEntries));
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }
    }
}
