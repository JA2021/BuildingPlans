using System.ComponentModel.DataAnnotations;

namespace BuildingPlans.Data.Entities
{
    public class BPConstructionChecklists:BaseEntity
    {
        [Key]
        public int? ConstructionChecklistID { get; set; }
        public int? ApplicationID { get; set; } 
        public string? ChecklistItem { get; set; } 
        public bool ? IsChecked { get; set; }
        public bool? isApplicable { get; set; } 


    }
}
