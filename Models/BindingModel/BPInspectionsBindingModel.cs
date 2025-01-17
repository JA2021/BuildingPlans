namespace BuildingPlans.Models.BindingModel
{
    public class BPInspectionsBindingModel
    {
        public int? InspectionID { get; set; }
        public int? ApplicationID { get; set; }
        public string? InspectionName { get; set; }
        public string? Notes { get; set; }
        public string? Status { get; set; }
        public bool? Inspected { get; set; }
        public DateTime? DateInspected { get; set; }
        public string? CreatedById { get; set; }
    }
}
