namespace BuildingPlans.Models.DTO
{
    public class BPBuildingControlChecklistDTO
    {
        public int? BuildingControlChecklistID { get; set; }
        public string? FunctionalArea { get; set; }
        public string? ChecklistItem { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
