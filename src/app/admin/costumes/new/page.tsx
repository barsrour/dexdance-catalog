import NewCostumeForm from "./NewCostimeForm";
import { createCostume } from "./actions";

export default function NewCostumePage() {
  return (
    <div dir="rtl">
      <h1 className="mb-6 text-3xl font-bold">
        הוספת תלבושת חדשה
      </h1>

      <NewCostumeForm saveCostume={createCostume} />
    </div>
  );
}