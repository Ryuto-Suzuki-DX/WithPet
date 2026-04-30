"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Menu, ChevronLeft, ChevronRight, X, Plus, Trash2, Pencil } from "lucide-react";
import { createPetEvent, deletePetEvent, getCareTemplates, getMyPage, getPetEvents, getRemindSetting, updatePetEvent } from "@/api/user";
import { extractData } from "@/api/data";
import type { MyPageData, MyPagePet } from "@/types/user/user_type";
import type { CreatePetEventItemRequest, CreatePetEventRequest, PetEvent, UpdatePetEventRequest } from "@/types/user/user_pet_event_type";
import type { CareTemplate, CareTemplateType } from "@/types/user/user_care_template_type";
import type { RemindSetting } from "@/types/user/user_setting_type";
import SideMenu from "@/app/user/sideMenu/sideMenu";

type CalendarCell = { date: Date; dayNumber: number; isCurrentMonth: boolean };
type WeekStartsOn = "sunday" | "monday";
type EventFormMode = "create" | "edit";
type PetEventType = "FOOD" | "SNACK" | "MEDICINE" | "VOMIT" | "POOP" | "HAIR" | "SKIN" | "EYE" | "NAIL" | "BATH" | "HOSPITAL";

type EventForm = {
  eventType: PetEventType;
  title: string;
  eventAt: string;
  nextEventAt: string;
  memo: string;
  imageKey: string;
  remindEnabled: boolean;
  remindAt: string;
  selectedTemplateId: number;
  items: CreatePetEventItemRequest[];
};

const WEEK_LABELS: Record<WeekStartsOn, string[]> = { sunday: ["日", "月", "火", "水", "木", "金", "土"], monday: ["月", "火", "水", "木", "金", "土", "日"] };

const EVENT_TYPE_OPTIONS: { value: PetEventType; label: string }[] = [
  { value: "FOOD", label: "食事" },
  { value: "SNACK", label: "おやつ" },
  { value: "MEDICINE", label: "薬・ワクチン" },
  { value: "VOMIT", label: "嘔吐" },
  { value: "POOP", label: "うんち" },
  { value: "HAIR", label: "毛" },
  { value: "SKIN", label: "皮膚" },
  { value: "EYE", label: "目" },
  { value: "NAIL", label: "爪" },
  { value: "BATH", label: "お風呂" },
  { value: "HOSPITAL", label: "病院" },
];

const TEMPLATE_EVENT_TYPES: PetEventType[] = ["FOOD", "SNACK", "MEDICINE"];
const NEXT_EVENT_TYPES: PetEventType[] = ["MEDICINE", "NAIL", "HAIR", "BATH", "HOSPITAL"];

function getEventTypeLabel(eventType: string) {
  return EVENT_TYPE_OPTIONS.find((option) => option.value === eventType)?.label ?? eventType;
}

function toTemplateType(eventType: PetEventType): CareTemplateType | null {
  if (eventType === "FOOD") return "FOOD";
  if (eventType === "SNACK") return "SNACK";
  if (eventType === "MEDICINE") return "MEDICINE";
  return null;
}

function formatMonthLabel(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function toDateTimeLocalValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function toApiDateTime(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function formatBirthDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}/${`${date.getMonth() + 1}`.padStart(2, "0")}/${`${date.getDate()}`.padStart(2, "0")}`;
}

function calculateAge(dateString: string) {
  const birthDate = new Date(dateString);
  const today = new Date();
  if (Number.isNaN(birthDate.getTime())) return "-";

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthdayYet = today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (hasNotHadBirthdayYet) age -= 1;

  return `${age}歳`;
}

function formatDateTime(dateString?: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}/${`${date.getMonth() + 1}`.padStart(2, "0")}/${`${date.getDate()}`.padStart(2, "0")} ${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
}

function createCalendarCells(baseDate: Date, weekStartsOn: WeekStartsOn): CalendarCell[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeek = firstDayOfMonth.getDay();
  const offset = weekStartsOn === "monday" ? (firstDayWeek + 6) % 7 : firstDayWeek;
  const calendarStartDate = new Date(year, month, 1 - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStartDate);
    date.setDate(calendarStartDate.getDate() + index);
    return { date, dayNumber: date.getDate(), isCurrentMonth: date.getMonth() === month };
  });
}

function getEventsByDate(events: PetEvent[], date: Date) {
  const targetKey = formatDateKey(date);
  return events.filter((event) => {
    const eventDate = new Date(event.eventAt);
    if (Number.isNaN(eventDate.getTime())) return false;
    return formatDateKey(eventDate) === targetKey;
  });
}

function createInitialForm(clickedDate: Date, remindSetting: RemindSetting | null): EventForm {
  const eventAt = new Date(clickedDate);
  eventAt.setHours(9, 0, 0, 0);

  const remindAt = new Date(eventAt);
  if (remindSetting?.isEmailEnabled) {
    remindAt.setDate(remindAt.getDate() - remindSetting.remindDaysBefore);
    remindAt.setHours(remindSetting.remindHour, 0, 0, 0);
  }

  return { eventType: "FOOD", title: "食事", eventAt: toDateTimeLocalValue(eventAt), nextEventAt: "", memo: "", imageKey: "", remindEnabled: remindSetting?.isEmailEnabled ?? false, remindAt: remindSetting?.isEmailEnabled ? toDateTimeLocalValue(remindAt) : "", selectedTemplateId: 0, items: [] };
}

function createFormFromEvent(event: PetEvent): EventForm {
  return {
    eventType: event.eventType as PetEventType,
    title: event.title,
    eventAt: toDateTimeLocalValue(new Date(event.eventAt)),
    nextEventAt: event.nextEventAt ? toDateTimeLocalValue(new Date(event.nextEventAt)) : "",
    memo: event.memo ?? "",
    imageKey: event.imageKey ?? "",
    remindEnabled: event.remindEnabled,
    remindAt: event.remindAt ? toDateTimeLocalValue(new Date(event.remindAt)) : "",
    selectedTemplateId: 0,
    items: event.items?.map((item) => ({ itemName: item.itemName, amount: item.amount, unit: item.unit })) ?? [],
  };
}

export default function UserPetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const petId = Number(params.petId);

  const [pet, setPet] = useState<MyPagePet | null>(null);
  const [events, setEvents] = useState<PetEvent[]>([]);
  const [careTemplates, setCareTemplates] = useState<CareTemplate[]>([]);
  const [remindSetting, setRemindSetting] = useState<RemindSetting | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [weekStartsOn, setWeekStartsOn] = useState<WeekStartsOn>("sunday");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayPopupOpen, setIsDayPopupOpen] = useState(false);

  const [eventFormMode, setEventFormMode] = useState<EventFormMode>("create");
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [initialFormText, setInitialFormText] = useState("");
  const [form, setForm] = useState<EventForm>(() => createInitialForm(new Date(), null));
  const [formMessage, setFormMessage] = useState("");
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const calendarCells = useMemo(() => createCalendarCells(currentMonth, weekStartsOn), [currentMonth, weekStartsOn]);
  const weekLabels = WEEK_LABELS[weekStartsOn];
  const isTemplateType = TEMPLATE_EVENT_TYPES.includes(form.eventType);
  const shouldShowNextEventAt = NEXT_EVENT_TYPES.includes(form.eventType);
  const selectedDateEvents = selectedDate ? getEventsByDate(events, selectedDate) : [];

  useEffect(() => {
    fetchInitialData();
  }, [petId]);

  useEffect(() => {
    if (!isEventFormOpen) return;

    const templateType = toTemplateType(form.eventType);
    if (!templateType) {
      setCareTemplates([]);
      return;
    }

    fetchCareTemplates(templateType);
  }, [form.eventType, isEventFormOpen]);

  async function fetchInitialData() {
    if (!petId) {
      setError("ペットIDが不正です。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await Promise.all([fetchPetDetail(), fetchPetEvents(), fetchRemindSetting()]);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchPetDetail() {
    try {
      const result = await getMyPage();
      const data = extractData<MyPageData>(result);
      const targetPet = data.pets?.find((item) => item.id === petId) ?? null;
      setPet(targetPet);

      if (!targetPet) {
        setError("ペット情報が見つかりません。");
      }
    } catch (err) {
      console.error(err);
      setError("ペット情報の取得に失敗しました。");
    }
  }

  async function fetchPetEvents() {
    if (!petId) return;

    setIsEventLoading(true);

    try {
      const result = await getPetEvents(petId);
      const data = extractData<PetEvent[]>(result);
      setEvents(data ?? []);
    } catch (err) {
      console.error(err);
      setError("ペットイベントの取得に失敗しました。");
    } finally {
      setIsEventLoading(false);
    }
  }

  async function fetchRemindSetting() {
    try {
      const result = await getRemindSetting();
      const data = extractData<RemindSetting>(result);
      setRemindSetting(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCareTemplates(templateType: CareTemplateType) {
    if (!petId) return;

    setIsTemplateLoading(true);

    try {
      const result = await getCareTemplates(petId, templateType);
      const data = extractData<CareTemplate[]>(result);
      setCareTemplates(data ?? []);
    } catch (err) {
      console.error(err);
      setError("登録済みセットの取得に失敗しました。");
    } finally {
      setIsTemplateLoading(false);
    }
  }

  function handlePrevMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function handleBack() {
    router.push("/user/mypage");
  }

  function openDayPopup(date: Date) {
    setSelectedDate(date);
    setIsDayPopupOpen(true);
  }

  function closeDayPopup() {
    setIsDayPopupOpen(false);
  }

  function openCreateEventForm(date: Date) {
    const nextForm = createInitialForm(date, remindSetting);
    setEventFormMode("create");
    setEditingEventId(null);
    setForm(nextForm);
    setInitialFormText(JSON.stringify(nextForm));
    setFormMessage("");
    setIsCloseConfirmOpen(false);
    setIsDeleteConfirmOpen(false);
    setIsEventFormOpen(true);
  }

  function openEditEventForm(event: PetEvent) {
    const nextForm = createFormFromEvent(event);
    setEventFormMode("edit");
    setEditingEventId(event.id);
    setForm(nextForm);
    setInitialFormText(JSON.stringify(nextForm));
    setFormMessage("");
    setIsCloseConfirmOpen(false);
    setIsDeleteConfirmOpen(false);
    setIsEventFormOpen(true);
  }

  function closeEventForm() {
    const currentFormText = JSON.stringify(form);

    if (currentFormText !== initialFormText) {
      setIsCloseConfirmOpen(true);
      return;
    }

    closeEventFormWithoutConfirm();
  }

  function closeEventFormWithoutConfirm() {
    setIsEventFormOpen(false);
    setIsCloseConfirmOpen(false);
    setIsDeleteConfirmOpen(false);
    setFormMessage("");
    setCareTemplates([]);
    setEditingEventId(null);
  }

  function handleChangeEventType(eventType: PetEventType) {
    const label = getEventTypeLabel(eventType);
    setForm((prev) => ({ ...prev, eventType, title: eventFormMode === "create" ? label : prev.title, selectedTemplateId: 0, items: [], nextEventAt: NEXT_EVENT_TYPES.includes(eventType) ? prev.nextEventAt : "" }));
  }

  function handleSelectTemplate(templateId: number) {
    const template = careTemplates.find((item) => item.id === templateId);

    if (!template) {
      setForm((prev) => ({ ...prev, selectedTemplateId: 0, items: [] }));
      return;
    }

    setForm((prev) => ({ ...prev, selectedTemplateId: template.id, title: template.name, imageKey: template.imageKey, memo: template.memo, items: template.items.map((item) => ({ itemName: item.itemName, amount: item.amount, unit: item.unit })) }));
  }

  function handleAddItem() {
    setForm((prev) => ({ ...prev, items: [...prev.items, { itemName: "", amount: 0, unit: "g" }] }));
  }

  function handleRemoveItem(index: number) {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, itemIndex) => itemIndex !== index) }));
  }

  function handleChangeItemName(index: number, value: string) {
    setForm((prev) => ({ ...prev, items: prev.items.map((item, itemIndex) => (itemIndex === index ? { ...item, itemName: value } : item)) }));
  }

  function handleChangeItemAmount(index: number, value: number) {
    setForm((prev) => ({ ...prev, items: prev.items.map((item, itemIndex) => (itemIndex === index ? { ...item, amount: value } : item)) }));
  }

  function handleChangeItemUnit(index: number, value: "g" | "cc") {
    setForm((prev) => ({ ...prev, items: prev.items.map((item, itemIndex) => (itemIndex === index ? { ...item, unit: value } : item)) }));
  }

  function validateForm() {
    if (!form.title.trim()) return "タイトルを入力してください。";

    const eventAt = toApiDateTime(form.eventAt);
    if (!eventAt) return "日時を入力してください。";

    if (isTemplateType && form.items.length === 0) return "明細を1件以上入力してください。";

    const hasEmptyItem = form.items.some((item) => !item.itemName.trim());
    if (hasEmptyItem) return "明細名を入力してください。";

    const hasInvalidAmount = form.items.some((item) => Number.isNaN(item.amount) || item.amount < 0);
    if (hasInvalidAmount) return "量は0以上で入力してください。";

    if (form.remindEnabled && !toApiDateTime(form.remindAt)) return "リマインド日時を入力してください。";

    return "";
  }

  function buildSaveParams(): CreatePetEventRequest {
    const eventAt = toApiDateTime(form.eventAt);

    return {
      eventType: form.eventType,
      title: form.title,
      eventAt: eventAt ?? "",
      nextEventAt: shouldShowNextEventAt ? toApiDateTime(form.nextEventAt) : null,
      memo: form.memo,
      imageKey: form.imageKey,
      remindEnabled: form.remindEnabled,
      remindAt: form.remindEnabled ? toApiDateTime(form.remindAt) : null,
      items: form.items,
    };
  }

  async function handleSaveEvent() {
    if (!petId) return;

    setFormMessage("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setFormMessage(validationMessage);
      return;
    }

    const params = buildSaveParams();

    setIsSaving(true);

    try {
      if (eventFormMode === "edit" && editingEventId) {
        await updatePetEvent(petId, editingEventId, params as UpdatePetEventRequest);
      } else {
        await createPetEvent(petId, params);
      }

      closeEventFormWithoutConfirm();
      await fetchPetEvents();
    } catch (err) {
      console.error(err);
      setFormMessage(eventFormMode === "edit" ? "イベントの更新に失敗しました。" : "イベントの保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteEvent() {
    if (!petId || !editingEventId) return;

    setIsDeleting(true);
    setFormMessage("");

    try {
      await deletePetEvent(petId, editingEventId);
      setIsDeleteConfirmOpen(false);
      closeEventFormWithoutConfirm();
      await fetchPetEvents();
    } catch (err) {
      console.error(err);
      setFormMessage("イベントの削除に失敗しました。");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#111827" }}>ペット詳細</h1>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>ペット1匹ごとの情報と専用カレンダーを確認できます</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <button type="button" onClick={() => openCreateEventForm(new Date())} style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "none", backgroundColor: "#f97316", color: "#ffffff", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}><Plus size={17} />新規作成</button>
                <button type="button" onClick={handleBack} style={{ border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#374151", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>マイページへ戻る</button>
                <button type="button" onClick={() => setIsMenuOpen(true)} aria-label="メニューを開く" style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", width: "42px", height: "42px", borderRadius: "10px", backgroundColor: "#fed7aa", color: "#9a3412" }}><Menu size={22} /></button>
              </div>
            </div>
          </section>

          {error && (
            <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#dc2626", fontWeight: 700 }}>{error}</p>
            </section>
          )}

          {isLoading ? (
            <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)" }}>
              <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>読み込み中です...</p>
            </section>
          ) : pet ? (
            <>
              <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "18px 24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#111827" }}>{pet.name}</h2>
                      <span style={{ display: "inline-block", borderRadius: "999px", padding: "6px 10px", backgroundColor: "#ffedd5", color: "#9a3412", fontSize: "12px", fontWeight: 700 }}>{pet.type}</span>
                    </div>
                    <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>{pet.name}専用のカレンダーです</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(120px, 1fr))", gap: "12px", minWidth: "360px" }}>
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px 12px", backgroundColor: "#f9fafb" }}><p style={{ margin: 0, fontSize: "12px", color: "#6b7280", fontWeight: 700 }}>誕生日</p><p style={{ margin: "4px 0 0", fontSize: "14px", color: "#111827", fontWeight: 700 }}>{formatBirthDate(pet.birthDate)}</p></div>
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px 12px", backgroundColor: "#f9fafb" }}><p style={{ margin: 0, fontSize: "12px", color: "#6b7280", fontWeight: 700 }}>年齢</p><p style={{ margin: "4px 0 0", fontSize: "14px", color: "#111827", fontWeight: 700 }}>{calculateAge(pet.birthDate)}</p></div>
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px 12px", backgroundColor: "#f9fafb" }}><p style={{ margin: 0, fontSize: "12px", color: "#6b7280", fontWeight: 700 }}>性別</p><p style={{ margin: "4px 0 0", fontSize: "14px", color: "#111827", fontWeight: 700 }}>{pet.sex || "-"}</p></div>
                  </div>
                </div>
              </section>

              <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827" }}>{pet.name}のカレンダー</h2>
                    <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>日付をクリックすると、その日の予定・記録を確認できます。{isEventLoading ? " イベントを読み込み中です..." : ""}</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <div style={{ display: "flex", gap: "6px", padding: "4px", borderRadius: "999px", backgroundColor: "#f3f4f6" }}>
                      <button type="button" onClick={() => setWeekStartsOn("sunday")} style={weekStartsOn === "sunday" ? { border: "none", borderRadius: "999px", padding: "7px 12px", backgroundColor: "#ffffff", color: "#9a3412", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)" } : { border: "none", borderRadius: "999px", padding: "7px 12px", backgroundColor: "transparent", color: "#6b7280", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>日曜始まり</button>
                      <button type="button" onClick={() => setWeekStartsOn("monday")} style={weekStartsOn === "monday" ? { border: "none", borderRadius: "999px", padding: "7px 12px", backgroundColor: "#ffffff", color: "#9a3412", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)" } : { border: "none", borderRadius: "999px", padding: "7px 12px", backgroundColor: "transparent", color: "#6b7280", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>月曜始まり</button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <button type="button" onClick={handlePrevMonth} style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "#f3f4f6", color: "#374151" }} aria-label="前の月へ"><ChevronLeft size={20} /></button>
                      <div style={{ minWidth: "120px", textAlign: "center", fontSize: "16px", fontWeight: 700, color: "#111827" }}>{formatMonthLabel(currentMonth)}</div>
                      <button type="button" onClick={handleNextMonth} style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", width: "38px", height: "38px", borderRadius: "8px", backgroundColor: "#f3f4f6", color: "#374151" }} aria-label="次の月へ"><ChevronRight size={20} /></button>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "8px", marginTop: "20px", marginBottom: "8px" }}>
                  {weekLabels.map((label) => (
                    <div key={label} style={{ textAlign: "center", fontSize: "13px", fontWeight: 700, color: "#6b7280", padding: "8px 0" }}>{label}</div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "8px" }}>
                  {calendarCells.map((cell, index) => {
                    const isToday = new Date().toDateString() === cell.date.toDateString();
                    const dayEvents = getEventsByDate(events, cell.date);

                    return (
                      <button key={`${cell.date.toDateString()}-${index}`} type="button" onClick={() => openDayPopup(cell.date)} style={{ minHeight: "104px", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "10px", backgroundColor: cell.isCurrentMonth ? "#ffffff" : "#f9fafb", color: cell.isCurrentMonth ? "#111827" : "#9ca3af", textAlign: "left", cursor: "pointer", boxShadow: isToday ? "inset 0 0 0 2px #f97316" : "none" }}>
                        <span style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 700 }}>{cell.dayNumber}</span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {dayEvents.map((event) => (
                            <span key={event.id} style={{ display: "block", borderRadius: "6px", padding: "4px 6px", backgroundColor: "#ffedd5", color: "#9a3412", fontSize: "12px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.title}</span>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          ) : null}
        </div>
      </main>

      {isDayPopupOpen && selectedDate && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.35)", display: "flex", justifyContent: "center", alignItems: "center", padding: "24px", zIndex: 50 }}>
          <div style={{ width: "100%", maxHeight: "90vh", overflowY: "auto", backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)", display: "flex", flexDirection: "column", gap: "18px", position: "relative", maxWidth: "640px" }} role="dialog" aria-modal="true">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827" }}>{formatDateLabel(selectedDate)}</h2>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>この日の予定・記録を確認できます。イベントを選ぶと編集できます。</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <button type="button" onClick={() => openCreateEventForm(selectedDate)} style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "none", backgroundColor: "#f97316", color: "#ffffff", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}><Plus size={17} />新規作成</button>
                <button type="button" onClick={closeDayPopup} style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", width: "38px", height: "38px", borderRadius: "999px", backgroundColor: "#f3f4f6", color: "#374151" }} aria-label="閉じる"><X size={22} /></button>
              </div>
            </div>

            {selectedDateEvents.length === 0 ? (
              <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>この日のイベントはまだありません。</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {selectedDateEvents.map((event) => (
                  <button key={event.id} type="button" onClick={() => openEditEventForm(event)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", width: "100%", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", backgroundColor: "#ffffff", color: "#111827", textAlign: "left", cursor: "pointer" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#111827" }}>{event.title}</p>
                      <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#6b7280" }}>{getEventTypeLabel(event.eventType)} / {formatDateTime(event.eventAt)}</p>
                    </div>
                    <Pencil size={17} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isEventFormOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.35)", display: "flex", justifyContent: "center", alignItems: "center", padding: "24px", zIndex: 50 }}>
          <div style={{ width: "100%", maxHeight: "90vh", overflowY: "auto", backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)", display: "flex", flexDirection: "column", gap: "18px", position: "relative", maxWidth: "760px" }} role="dialog" aria-modal="true">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827" }}>{eventFormMode === "edit" ? "イベント編集" : "イベント登録"}</h2>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>{eventFormMode === "edit" ? "既存の予定・記録を編集します。" : "選択した日付に予定・記録を登録します。"}</p>
              </div>
              <button type="button" onClick={closeEventForm} style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", width: "38px", height: "38px", borderRadius: "999px", backgroundColor: "#f3f4f6", color: "#374151" }} aria-label="閉じる"><X size={22} /></button>
            </div>

            {formMessage && <div style={{ border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 12px", backgroundColor: "#fef2f2", color: "#b91c1c", fontSize: "14px", fontWeight: 700 }}>{formMessage}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
              <div>
                <label htmlFor="eventType" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>区分</label>
                <select id="eventType" value={form.eventType} onChange={(e) => handleChangeEventType(e.target.value as PetEventType)} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}>
                  {EVENT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>

              {isTemplateType && (
                <div>
                  <label htmlFor="template" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>登録済みセット</label>
                  <select id="template" value={form.selectedTemplateId} onChange={(e) => handleSelectTemplate(Number(e.target.value))} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}>
                    <option value={0}>{isTemplateLoading ? "読み込み中..." : "登録済みセットを選択してください"}</option>
                    {careTemplates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
                  </select>
                  <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#6b7280", lineHeight: 1.6 }}>選択すると明細へ反映されます。必要に応じて今回の量に変更できます。</p>
                </div>
              )}

              <div>
                <label htmlFor="title" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>タイトル</label>
                <input id="title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="例：病院、いつものごはん" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
              </div>

              <div>
                <label htmlFor="eventAt" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>日時</label>
                <input id="eventAt" type="datetime-local" value={form.eventAt} onChange={(e) => setForm((prev) => ({ ...prev, eventAt: e.target.value }))} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
              </div>

              {shouldShowNextEventAt && (
                <div>
                  <label htmlFor="nextEventAt" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>次回予定日</label>
                  <input id="nextEventAt" type="datetime-local" value={form.nextEventAt} onChange={(e) => setForm((prev) => ({ ...prev, nextEventAt: e.target.value }))} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
                </div>
              )}

              <div>
                <label htmlFor="imageKey" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>画像キー</label>
                <input id="imageKey" value={form.imageKey} onChange={(e) => setForm((prev) => ({ ...prev, imageKey: e.target.value }))} placeholder="S3連携前の仮入力欄" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
              </div>
            </div>

            {(isTemplateType || form.eventType === "VOMIT" || form.eventType === "POOP") && (
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>明細</h3>
                  <button type="button" onClick={handleAddItem} style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #fed7aa", borderRadius: "8px", padding: "8px 12px", backgroundColor: "#fff7ed", color: "#9a3412", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}><Plus size={16} />明細追加</button>
                </div>

                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {form.items.map((item, index) => (
                    <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 110px 90px 44px", gap: "8px", alignItems: "center" }}>
                      <input value={item.itemName} onChange={(e) => handleChangeItemName(index, e.target.value)} placeholder="項目名" aria-label={`明細${index + 1}の項目名`} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
                      <input type="number" min={0} value={item.amount} onChange={(e) => handleChangeItemAmount(index, Number(e.target.value))} placeholder="量" aria-label={`明細${index + 1}の量`} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
                      <select value={item.unit} onChange={(e) => handleChangeItemUnit(index, e.target.value as "g" | "cc")} aria-label={`明細${index + 1}の単位`} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}>
                        <option value="g">g</option>
                        <option value="cc">cc</option>
                      </select>
                      <button type="button" onClick={() => handleRemoveItem(index)} aria-label="明細削除" style={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #fecaca", cursor: "pointer", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "#fef2f2", color: "#b91c1c" }}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="memo" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>メモ</label>
              <textarea id="memo" value={form.memo} onChange={(e) => setForm((prev) => ({ ...prev, memo: e.target.value }))} rows={3} placeholder="メモを入力してください" style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px", resize: "vertical" }} />
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                <input type="checkbox" checked={form.remindEnabled} onChange={(e) => setForm((prev) => ({ ...prev, remindEnabled: e.target.checked, remindAt: e.target.checked ? prev.remindAt : "" }))} />
                <span>リマインドする</span>
              </label>

              {form.remindEnabled && (
                <div>
                  <label htmlFor="remindAt" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: 700, color: "#374151" }}>リマインド日時</label>
                  <input id="remindAt" type="datetime-local" value={form.remindAt} onChange={(e) => setForm((prev) => ({ ...prev, remindAt: e.target.value }))} style={{ width: "100%", maxWidth: "260px", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }} />
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "space-between" }}>
              <div>
                {eventFormMode === "edit" && <button type="button" onClick={() => setIsDeleteConfirmOpen(true)} disabled={isDeleting || isSaving} style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid #fecaca", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}><Trash2 size={16} />削除</button>}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <button type="button" onClick={closeEventForm} style={{ border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#374151", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }} disabled={isSaving}>キャンセル</button>
                <button type="button" onClick={handleSaveEvent} disabled={isSaving} style={{ border: "none", backgroundColor: "#f97316", color: "#ffffff", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>{isSaving ? "保存中..." : "保存する"}</button>
              </div>
            </div>

            {isCloseConfirmOpen && (
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(17, 24, 39, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", zIndex: 60 }}>
                <div style={{ width: "100%", maxWidth: "420px", borderRadius: "12px", padding: "20px", backgroundColor: "#ffffff", boxShadow: "0 16px 40px rgba(0, 0, 0, 0.2)" }}>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>保存されていない変更があります</h3>
                  <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#4b5563", lineHeight: 1.7 }}>このまま閉じると、入力中の内容は保存されません。</p>
                  <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button type="button" onClick={() => setIsCloseConfirmOpen(false)} style={{ border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#374151", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>編集を続ける</button>
                    <button type="button" onClick={closeEventFormWithoutConfirm} style={{ border: "none", backgroundColor: "#dc2626", color: "#ffffff", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>保存せず閉じる</button>
                  </div>
                </div>
              </div>
            )}

            {isDeleteConfirmOpen && (
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(17, 24, 39, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", zIndex: 60 }}>
                <div style={{ width: "100%", maxWidth: "420px", borderRadius: "12px", padding: "20px", backgroundColor: "#ffffff", boxShadow: "0 16px 40px rgba(0, 0, 0, 0.2)" }}>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>イベントを削除しますか？</h3>
                  <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#4b5563", lineHeight: 1.7 }}>このイベントを削除します。削除したイベントはカレンダーに表示されなくなります。</p>
                  <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button type="button" onClick={() => setIsDeleteConfirmOpen(false)} style={{ border: "1px solid #d1d5db", backgroundColor: "#ffffff", color: "#374151", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }} disabled={isDeleting}>キャンセル</button>
                    <button type="button" onClick={handleDeleteEvent} style={{ border: "none", backgroundColor: "#dc2626", color: "#ffffff", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }} disabled={isDeleting}>{isDeleting ? "削除中..." : "削除する"}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}