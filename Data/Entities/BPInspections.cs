using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPInspections : BaseEntity
    {
        [Key]
        public int? InspectionID { get; set; } 
        public int? ApplicationID { get; set; } 
        public string? InspectionName { get; set; } 
        public string? Notes { get; set; } 
        public string? Status { get; set; } 
        public bool? Inspected { get; set; } 
        public DateTime? DateInspected { get; set; } 
    }
}
