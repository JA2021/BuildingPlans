using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPBuildingControlChecklist : BaseEntity
    {
        [Key]
        public int? BuildingControlChecklistID { get; set; }
        public string? FunctionalArea { get; set; }
        public string? ChecklistItem { get; set; } 
    }
}
