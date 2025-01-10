namespace BuildingPlans.Models.DTO
{
    public class BPConstructionChecklistsDTO
    {
        public int? ConstructionChecklistID { get; set; }
        public int? ApplicationID { get; set; }
        public string? ChecklistItem { get; set; }
        public bool? IsChecked { get; set; }
        public bool? isApplicable { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; } 
        public DateTime? DateUpdated { get; set; } 

    }
}
