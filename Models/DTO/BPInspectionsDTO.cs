namespace BuildingPlans.Models.DTO
{
    public class BPInspectionsDTO
    {
        public int? InspectionID { get; set; }
        public int? ApplicationID { get; set; }
        public string? InspectionName { get; set; }
        public string? Notes { get; set; }
        public string? Status { get; set; }
        public bool? Inspected { get; set; }
        public DateTime? DateInspected { get; set; }
        public string? CreatedById { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}
