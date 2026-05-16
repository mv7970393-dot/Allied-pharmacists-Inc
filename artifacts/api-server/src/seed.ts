import { db, filesTable, foldersTable } from "@workspace/db";
import { count } from "drizzle-orm";
import { logger } from "./lib/logger";

const SEED_FILES = [
  { id: "upload-1778874866956", originalName: "BD Injection Technique Reference Card (1).pdf", objectPath: "files/1778876948616-khxuil6es8b.pdf", folderId: "f1", size: 166, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778874881740", originalName: "BDshowpadresource (1).pdf", objectPath: "files/1778876949719-hsnnznov3mm.pdf", folderId: "f1", size: 163155, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778874906705", originalName: "BD-30995 Principles of injection technique, table.pdf", objectPath: "files/1778876950618-eutmo66yb6j.pdf", folderId: "f1", size: 73085, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778874969094", originalName: "1.png", objectPath: "files/1778876951548-jcpv4xrs08q.png", folderId: "f2", size: 4141779, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778874976580", originalName: "2.png", objectPath: "files/1778876953044-s4g8yk4ihi.png", folderId: "f2", size: 3355195, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778874982930", originalName: "3.png", objectPath: "files/1778876954519-xy3tc3r9et.png", folderId: "f2", size: 309260, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778874989657", originalName: "4.png", objectPath: "files/1778876955486-xuygqmfd8ge.png", folderId: "f2", size: 310965, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875009222", originalName: "General Awareness.png", objectPath: "files/1778876956491-knhn3g17fs.png", folderId: "f2", size: 2048637, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875021883", originalName: "General Awareness (2).png", objectPath: "files/1778876958171-zg34tdpc1j.png", folderId: "f2", size: 1977163, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875032902", originalName: "General Awareness (3).png", objectPath: "files/1778876959412-up3lwb24nse.png", folderId: "f2", size: 330833, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875054849", originalName: "General Awareness (4).png", objectPath: "files/1778876960304-kuo9mchxycf.png", folderId: "f2", size: 436800, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875081219", originalName: "20260126 API Post-Tradeshow Webinar Presentation (2).pdf", objectPath: "files/1778876961523-r25pv7jd2r.pdf", folderId: "f3", size: 2653024, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875087652", originalName: "20260126 API webinar graphic (2).jpeg", objectPath: "files/1778876962710-jm0brnb20em.jpeg", folderId: "f3", size: 210302, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875137427", originalName: "Payment Goat API Preferred Rates (2) (1).pdf", objectPath: "files/1778876963695-xb87vkyvsh.pdf", folderId: "f4", size: 503602, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875171559", originalName: "Payment Goat Info Form - API (1).pdf", objectPath: "files/1778876965010-dhwupsc8mz4.pdf", folderId: "f4", size: 622890, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875204857", originalName: "Communimed API Offerings (1).pdf", objectPath: "files/1778876966103-qtx44frkxx.pdf", folderId: "f5", size: 566030, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875228970", originalName: "API BENEFITS DOCUMENT (3).pdf", objectPath: "files/1778876967475-5fi0q37sxb8.pdf", folderId: "f5", size: 1595885, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875241520", originalName: "API SCOTIABANK DEALS (1).pdf", objectPath: "files/1778876968832-wxdizixt22.pdf", folderId: "f5", size: 454318, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875325815", originalName: "202602 Incident Reporting for API Members (1) (2).pdf", objectPath: "files/1778876969939-qdphpi2eoo.pdf", folderId: "f5", size: 428308, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875355547", originalName: "Richards Packaging Pamphlet API.pdf", objectPath: "files/1778876971172-rontkcs2g7i.pdf", folderId: "f5", size: 3574549, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875656235", originalName: "API Flu-Test-Influenza-Vaccine-Consent-Form.pdf", objectPath: "files/1778876973035-xswbaa3akvf.pdf", folderId: "f6", size: 5068153, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875861726", originalName: "API & UPI Minor Ailments Poster.png", objectPath: "files/1778876974504-4cgnxthlabp.png", folderId: "f7", size: 426087, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875934853", originalName: "hpvposter.pdf", objectPath: "files/1778876975867-lnbd8okkaer.pdf", folderId: "f7", size: 6720286, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875949793", originalName: "minorailmentsrackcard.pdf", objectPath: "files/1778876977699-pnmgbpzdto.pdf", folderId: "f7", size: 3896093, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778875974971", originalName: "Fluvaccineposter20251wcode.pdf", objectPath: "files/1778876980051-3v7z57l22i4.pdf", folderId: "f7", size: 31353613, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876092389", originalName: "ODB Short Dispensing Clinical Assessment Form.pdf", objectPath: "files/1778876986326-7org9tvrk3m.pdf", folderId: "f6", size: 159402, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876101900", originalName: "PRIVATEINSURANCEShort Dispensing Clinical Assessment FormV2.pdf", objectPath: "files/1778876987252-oauca8559me.pdf", folderId: "f6", size: 165693, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876161962", originalName: "seasonalallergiesrackcard.pdf", objectPath: "files/1778876988234-esug2d4uba8.pdf", folderId: "f7", size: 3255165, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876172462", originalName: "vaccinerackcard.pdf.pdf", objectPath: "files/1778876989839-zl92hijbyk.pdf", folderId: "f7", size: 3377249, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876209988", originalName: "pharmacyextendpharmacy.pdf", objectPath: "files/1778876991419-znphpqxwv1q.pdf", folderId: "f7", size: 1021573, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876240643", originalName: "API Pharmacy Compliance Toolkit.pdf", objectPath: "files/1778876992670-t9ruhrthtd8.pdf", folderId: "f8", size: 244022, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876261121", originalName: "API Compounding_TemplateMasterFormulationRecord.pdf", objectPath: "files/1778876993665-mibgdizxnz.pdf", folderId: "f8", size: 161123, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876309847", originalName: "API Policy-and-Procedure-Manual-Template.pdf", objectPath: "files/1778876994666-jn1wbd0mxi8.pdf", folderId: "f8", size: 985597, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876386538", originalName: "Frequent_Dispensing_Form.pdf", objectPath: "files/1778876995958-k9lpttlxxb.pdf", folderId: "f6", size: 152778, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876415974", originalName: "Standards of Practice Template.pdf", objectPath: "files/1778876996733-z5tv9x4mtnp.pdf", folderId: "f8", size: 250447, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876626686", originalName: "Ontario Community Budget Discussions2024.jpeg", objectPath: "files/1778876997658-9d0u9nobzc.jpeg", folderId: "f9", size: 150480, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876727716", originalName: "Ontario Community Budget Discussions2025.jpeg", objectPath: "files/1778876998490-8wx3eie75k.jpeg", folderId: "f9", size: 195521, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876779367", originalName: "Ontario Community Budget Discussions2024(2).jpeg", objectPath: "files/1778876999404-3znzvlk8l1z.jpeg", folderId: "f9", size: 154320, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876825168", originalName: "API's Position on PPN.pdf", objectPath: "files/1778877000318-ah6e0hgj3u.pdf", folderId: "f9", size: 559882, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778876834561", originalName: "PrescribeIT Statement.pdf", objectPath: "files/1778877001568-gp9e3sd5ukj.pdf", folderId: "f9", size: 131135, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877170387", originalName: "CE Sunday 2024.jpeg", objectPath: "files/1778877339139-xmwat5as7bj.jpeg", folderId: "f10", size: 258619, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877175786", originalName: "CE Sunday 2024 - 2.jpeg", objectPath: "files/1778877340466-kt3s1lu93o.jpeg", folderId: "f10", size: 253147, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877181221", originalName: "CE Sunday 2024 - 3.jpeg", objectPath: "files/1778877341420-wlgae1aj4y.jpeg", folderId: "f10", size: 49755, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877186654", originalName: "CE Sunday 2024 - 4.jpeg", objectPath: "files/1778877342127-oz34di035m.jpeg", folderId: "f10", size: 378766, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877194640", originalName: "CE Sunday 2025 - 1.jpeg", objectPath: "files/1778877343067-ph5x0tp3bf.jpeg", folderId: "f10", size: 207019, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877200844", originalName: "CE Sunday 2025 -2.jpeg", objectPath: "files/1778877344274-8zw2aba4xz8.jpeg", folderId: "f10", size: 171453, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877205530", originalName: "CE Sunday 2025 - 3.jpeg", objectPath: "files/1778877345181-mfkfv0faryb.jpeg", folderId: "f10", size: 222704, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877210207", originalName: "CE Sunday 2025 -4.jpeg", objectPath: "files/1778877346100-fr424lhf4ab.jpeg", folderId: "f10", size: 158728, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877226085", originalName: "Oxygen Investment Forum - 1.jpeg", objectPath: "files/1778877347008-pl8k9q7pn1e.jpeg", folderId: "f10", size: 98580, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877231916", originalName: "Oxygen Investment Forum - 2.jpeg", objectPath: "files/1778877347791-atvtm0hdq6t.jpeg", folderId: "f10", size: 108842, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877237489", originalName: "Oxygen Investment Forum - 3.jpeg", objectPath: "files/1778877348627-ouyq1uqhffg.jpeg", folderId: "f10", size: 110992, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877242210", originalName: "Oxygen Investment Forum - 4.jpeg", objectPath: "files/1778877349484-88ab1ncz2i.jpeg", folderId: "f10", size: 138929, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877246462", originalName: "Oxygen Investment Forum - 5.jpeg", objectPath: "files/1778877350348-iyvf6n4ec9.jpeg", folderId: "f10", size: 179287, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877250649", originalName: "Oxygen Investment Forum - 6.jpeg", objectPath: "files/1778877351254-qvn4fkwlg3.jpeg", folderId: "f10", size: 106052, date: "2026-05-15", type: "img", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877306962", originalName: "Analgesics 04ft .pdf", objectPath: "files/1778877352217-s93kb6xdzjf.pdf", folderId: "f11", size: 2456134, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877314655", originalName: "Cough, Cold and Allergies 04ft.pdf", objectPath: "files/1778877353938-na16xvnmjj.pdf", folderId: "f11", size: 4135450, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877320034", originalName: "Digestive Health 04ft.pdf", objectPath: "files/1778877355690-jz1hmcmsazp.pdf", folderId: "f11", size: 2139771, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877325394", originalName: "Our Trusted Brands Newsletter (1).pdf", objectPath: "files/1778877357318-2uf6rgjlnul.pdf", folderId: "f11", size: 1049577, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
  { id: "upload-1778877331608", originalName: "Vitamins 04ft.pdf", objectPath: "files/1778877358642-8z2qs1y1ga3.pdf", folderId: "f11", size: 3692986, date: "2026-05-15", type: "pdf", uploadedBy: "sally@alliedpharmacists.ca" },
];

export async function seedIfEmpty() {
  try {
    const [{ value }] = await db.select({ value: count() }).from(filesTable);
    if (value > 0) {
      logger.info({ count: value }, "DB already has files, skipping seed");
      return;
    }
    logger.info("DB is empty, seeding files...");
    await db.insert(filesTable).values(SEED_FILES).onConflictDoNothing();
    logger.info({ count: SEED_FILES.length }, "Seed complete");
  } catch (err) {
    logger.error({ err }, "Seed failed");
  }
}
