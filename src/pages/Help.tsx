
import { useLanguage } from "@/contexts/LanguageContext";

const Help = () => {
  const { language } = useLanguage();

  const isHebrew = language === "he";
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4" dir={isHebrew ? "rtl" : "ltr"}>
      <div className="prose dark:prose-invert max-w-none">
        {isHebrew ? (
          <>
            <h1 className="text-3xl font-bold mb-8">מדריך למשתמש</h1>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">ניהול מטלות</h2>
            <ul className="list-disc space-y-2 mr-6">
              <li>הוספת מטלה: לחץ על כפתור ה-+ בתפריט הצף כדי להוסיף מטלה חדשה</li>
              <li>עריכת מטלה: לחץ על המטלה כדי לערוך את הפרטים שלה</li>
              <li>סינון מטלות: השתמש בפילטרים בחלק העליון כדי לסנן לפי סטטוס או תצוגה</li>
              <li>שינוי סטטוס: לחץ על הסטטוס של המטלה כדי לשנות אותו</li>
              <li>הוספה מהירה של מקצוע: לחץ על כפתור ה-+ בתפריט הצף והוסף מקצוע חדש באנגלית ובעברית</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">התאמה אישית</h2>
            <ul className="list-disc space-y-2 mr-6">
              <li>שינוי שפה: לחץ על כפתור השפה בפינה השמאלית העליונה</li>
              <li>שינוי צבעים: לחץ על כפתור הצבעים בתפריט הצף לשינוי ערכת הצבעים</li>
              <li>הגדרות: לחץ על כפתור ההגדרות בתפריט הצף לשינוי הגדרות נוספות</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">תכונות נוספות</h2>
            <ul className="list-disc space-y-2 mr-6">
              <li>קבצים מצורפים: הוסף קבצים למטלות דרך כפתור הקבצים המצורפים</li>
              <li>מצב כיף: לחץ פעמיים על המילה "שיעורי בית" לאפקטים מיוחדים</li>
              <li>סטטיסטיקות: צפה בסטטיסטיקות המטלות שלך בחלק העליון של הדף</li>
            </ul>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">User Manual</h1>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Assignment Management</h2>
            <ul className="list-disc space-y-2 ml-6">
              <li>Add Assignment: Click the + button in the floating menu to add a new assignment</li>
              <li>Edit Assignment: Click on an assignment to edit its details</li>
              <li>Filter Assignments: Use the filters at the top to filter by status or view</li>
              <li>Change Status: Click on an assignment's status to change it</li>
              <li>Quick Add Subject: Click the + button in the floating menu to add a new subject in both English and Hebrew</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Customization</h2>
            <ul className="list-disc space-y-2 ml-6">
              <li>Change Language: Click the language button in the top left corner</li>
              <li>Change Colors: Click the color palette button in the floating menu to change the color scheme</li>
              <li>Settings: Click the settings button in the floating menu for additional settings</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Additional Features</h2>
            <ul className="list-disc space-y-2 ml-6">
              <li>Attachments: Add files to assignments through the attachments button</li>
              <li>Fun Mode: Double click on the word "homework" for special effects</li>
              <li>Statistics: View your assignment statistics at the top of the page</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Help;
