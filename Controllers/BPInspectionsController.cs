using BuildingPlans.Data;
using BuildingPlans.Data.Entities;
using BuildingPlans.DTO;
using BuildingPlans.Models;
using BuildingPlans.Models.BindingModel;
using BuildingPlans.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Runtime.InteropServices;
using System.Security.Policy;
namespace BuildingPlans.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BPInspectionsController : ControllerBase
    {
        private readonly AppDBContext _context; 

        public BPInspectionsController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddUpdateInspection")]
        public async Task<object> AddUpdateInspection([FromBody] BPInspectionsBindingModel model)
        {
            try
            {

                var result = new object();

                if(model.ApplicationID == null || model.InspectionName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    if(model.InspectionID == 0)
                    {
                        model.InspectionID = null; 
                    }

                    var tempInspection = _context.BPInspections.FirstOrDefault(x => x.InspectionID == model.InspectionID);

                    if(tempInspection == null)
                    {
                        tempInspection = new BPInspections()
                        {
                            ApplicationID = model.ApplicationID,
                            InspectionName = model.InspectionName,
                            Notes = model.Notes,
                            Status = model.Status,
                            Inspected = model.Inspected,
                            DateInspected = model.DateInspected,
                            CreatedById = model.CreatedById,
                            DateCreated = DateTime.Now,
                            DateUpdated = DateTime.Now,
                            isActive = true 

                        };

                        await _context.BPInspections.AddAsync(tempInspection);
                        await _context.SaveChangesAsync();

                        result = tempInspection;
                    } 

                    else
                    {
                        if(model.Notes != null)
                        {
                            tempInspection.Notes = model.Notes;
                        }

                        if(model.Status != null)
                        {
                            tempInspection.Status = model.Status;
                        }
                        if (model.Inspected != null)
                        {
                            tempInspection.Inspected = model.Inspected;
                        }
                        if(model.DateInspected != null)
                        {
                            tempInspection.DateInspected = model.DateInspected;
                        }
                        tempInspection.DateUpdated = DateTime.Now;

                        _context.Update(tempInspection);
                        await _context.SaveChangesAsync();

                        result = tempInspection;
                    }
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, (model.InspectionID > 0 ? " Inspection Updated Successfully" : "Inspection Created Successfully"), result));
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message,null));
            }
        }

        [HttpPost("GetAllInpectionsForApplication")]
        public async Task<object> GetAllInpectionsForApplication([FromBody] BPInspectionsBindingModel model)
        {
            try
            {
                if(model.ApplicationID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));

                }
                else
                {
                    var result = await (from inspection in _context.BPInspections
                                        where inspection.ApplicationID == model.ApplicationID && inspection.isActive == true
                                        select new BPInspectionsDTO()
                                        {
                                            InspectionID = inspection.InspectionID,
                                            ApplicationID = inspection.ApplicationID,
                                            InspectionName = inspection.InspectionName,
                                            Notes = inspection.Notes,
                                            Status = inspection.Status,
                                            Inspected = inspection.Inspected,
                                            DateInspected = inspection.DateInspected,
                                            CreatedById = inspection.CreatedById,
                                            DateCreated = inspection.DateCreated,
                                            DateUpdated = inspection.DateUpdated,

                                        }).ToListAsync();

                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Inspections For Application", result)); 
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("DeleteInspectionByInspectionID")]
        public async Task<object> DeleteInspectionByInspectionID([FromBody] BPInspectionsBindingModel model)
        {
            try
            {
                if (model.InspectionID == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var tempInspection = _context.BPInspections.FirstOrDefault(x => x.InspectionID == model.InspectionID);

                    if(tempInspection == null)
                    {
                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Could not find entry in database", false));
                    }
                    else
                    {
                        tempInspection.isActive = false;
                        tempInspection.DateUpdated = DateTime.Now;

                        _context.Update(tempInspection);
                        await _context.SaveChangesAsync();

                        return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Inspection deleted successfully", true));
                    }
                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null)); 
            }
        }

        [HttpPost("GetAllInspectionsCommentsForApplicationByInspectionName")]
        public async Task<object> GetAllInspectionsCommentsForApplicationByInspectionName([FromBody] BPInspectionsBindingModel model)
        {
            try
            {
                if (model.ApplicationID == null || model.InspectionName == null)
                {
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, "Parameters are missing", null));
                }
                else
                {
                    var result = await (from inspection in _context.BPInspections
                                        where inspection.ApplicationID == model.ApplicationID && inspection.InspectionName == model.InspectionName && inspection.isActive == true
                                        select new BPInspectionsDTO()
                                        {
                                            InspectionID = inspection.InspectionID,
                                            ApplicationID = inspection.ApplicationID,
                                            InspectionName = inspection.InspectionName,
                                            Notes = inspection.Notes,
                                            Status = inspection.Status,
                                            Inspected = inspection.Inspected,
                                            DateInspected = inspection.DateInspected,
                                            CreatedById = inspection.CreatedById,
                                            DateCreated = inspection.DateCreated,
                                            DateUpdated = inspection.DateUpdated,

                                        }).ToListAsync();
                    return await Task.FromResult(new ResponseModel(Enums.ResponseCode.OK, "Got All Inspection Comments for current Inspection", result));

                }
            }
            catch(Exception ex)
            {
                return await Task.FromResult(new ResponseModel(Enums.ResponseCode.Error, ex.Message, null)); 
            }
        }
    }
}
