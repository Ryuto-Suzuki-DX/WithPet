"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Plus, Trash2 } from "lucide-react";
import {
  createCareTemplate,
  deleteCareTemplate,
  getCareTemplates,
  getMyPage,
  updateCareTemplate,
} from "@/api/user";
import { extractData } from "@/api/data";
import type { MyPageData, MyPagePet } from "@/types/user/user_type";
import type {
  CareTemplate,
  CareTemplateType,
  CareTemplateUnit,
  CreateCareTemplateRequest,
  UpdateCareTemplateRequest,
} from "@/types/user/user_care_template_type";
import SideMenu from "@/app/user/sideMenu/sideMenu";

type CareTemplateFormItem = {
  localId: number;
  itemName: string;
  amount: number;
  unit: CareTemplateUnit;
};

type CareTemplateForm = {
  templateType: CareTemplateType;
  name: string;
  imageKey: string;
  items: CareTemplateFormItem[];
  isFixed: boolean;
  fixedDaysOfWeek: string[];
  fixedTime: string;
  memo: string;
};

const TEMPLATE_TYPE_LABELS: Record<CareTemplateType, string> = {
  FOOD: "食事",
  SNACK: "おやつ",
  MEDICINE: "薬・ワクチン",
};

const WEEKDAY_OPTIONS = [
  { value: "MON", label: "月" },
  { value: "TUE", label: "火" },
  { value: "WED", label: "水" },
  { value: "THU", label: "木" },
  { value: "FRI", label: "金" },
  { value: "SAT", label: "土" },
  { value: "SUN", label: "日" },
];

function createInitialForm(templateType: CareTemplateType): CareTemplateForm {
  return {
    templateType,
    name: "",
    imageKey: "",
    items: [{ localId: Date.now(), itemName: "", amount: 0, unit: "g" }],
    isFixed: false,
    fixedDaysOfWeek: [],
    fixedTime: "09:00",
    memo: "",
  };
}

function createFormFromTemplate(template: CareTemplate): CareTemplateForm {
  return {
    templateType: template.templateType,
    name: template.name,
    imageKey: template.imageKey ?? "",
    items:
      template.items.length > 0
        ? template.items.map((item) => ({
            localId: Date.now() + item.id,
            itemName: item.itemName,
            amount: item.amount,
            unit: item.unit,
          }))
        : [{ localId: Date.now(), itemName: "", amount: 0, unit: "g" }],
    isFixed: template.isFixed,
    fixedDaysOfWeek: template.fixedDaysOfWeek ?? [],
    fixedTime: template.fixedTime || "09:00",
    memo: template.memo ?? "",
  };
}

function formatFixedDays(days: string[]) {
  if (days.length === 0) {
    return "-";
  }

  return WEEKDAY_OPTIONS.filter((option) => days.includes(option.value))
    .map((option) => option.label)
    .join("・");
}

function buildRequestFromForm(form: CareTemplateForm): CreateCareTemplateRequest {
  return {
    templateType: form.templateType,
    name: form.name.trim(),
    imageKey: form.imageKey.trim(),
    items: form.items.map((item) => ({
      itemName: item.itemName.trim(),
      amount: item.amount,
      unit: item.unit,
    })),
    isFixed: form.isFixed,
    fixedDaysOfWeek: form.isFixed ? form.fixedDaysOfWeek : [],
    fixedTime: form.isFixed ? form.fixedTime : "",
    memo: form.memo.trim(),
  };
}

export default function UserCareTemplatesPage() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [pets, setPets] = useState<MyPagePet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState(0);
  const [selectedType, setSelectedType] = useState<CareTemplateType>("FOOD");

  const [templates, setTemplates] = useState<CareTemplate[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pageMessage, setPageMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [form, setForm] = useState<CareTemplateForm>(() => createInitialForm("FOOD"));

  const [deleteTarget, setDeleteTarget] = useState<CareTemplate | null>(null);

  const selectedPet = useMemo(() => {
    return pets.find((pet) => pet.id === selectedPetId) ?? null;
  }, [pets, selectedPetId]);

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (!selectedPetId) {
      setTemplates([]);
      return;
    }

    fetchTemplates(selectedPetId, selectedType);
  }, [selectedPetId, selectedType]);

  async function fetchPets() {
    setIsLoadingPets(true);
    setPageMessage("");

    try {
      const result = await getMyPage();
      const data = extractData<MyPageData>(result);
      const nextPets = data.pets ?? [];

      setPets(nextPets);

      if (nextPets.length > 0) {
        setSelectedPetId((current) => current || nextPets[0].id);
      } else {
        setSelectedPetId(0);
        setPageMessage("登録されているペットがありません。先にペットを登録してください。");
      }
    } catch (err) {
      console.error(err);
      setPageMessage("ペット情報の取得に失敗しました。");
    } finally {
      setIsLoadingPets(false);
    }
  }

  async function fetchTemplates(petId: number, templateType: CareTemplateType) {
    setIsLoadingTemplates(true);
    setPageMessage("");

    try {
      const result = await getCareTemplates(petId, templateType);
      const data = extractData<CareTemplate[]>(result);
      setTemplates(data ?? []);
    } catch (err) {
      console.error(err);
      setPageMessage("セット一覧の取得に失敗しました。");
    } finally {
      setIsLoadingTemplates(false);
    }
  }

  function handleOpenCreateForm() {
    setEditingTemplateId(null);
    setForm(createInitialForm(selectedType));
    setFormMessage("");
    setIsFormOpen(true);
  }

  function handleEditTemplate(template: CareTemplate) {
    setEditingTemplateId(template.id);
    setForm(createFormFromTemplate(template));
    setFormMessage("");
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setEditingTemplateId(null);
    setIsFormOpen(false);
    setFormMessage("");
    setForm(createInitialForm(selectedType));
  }

  function handleChangeType(type: CareTemplateType) {
    setSelectedType(type);

    if (isFormOpen && !editingTemplateId) {
      setForm((prev) => ({
        ...prev,
        templateType: type,
      }));
    }
  }

  function handleAddItem() {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          localId: Date.now(),
          itemName: "",
          amount: 0,
          unit: "g",
        },
      ],
    }));
  }

  function handleRemoveItem(localId: number) {
    setForm((prev) => ({
      ...prev,
      items:
        prev.items.length === 1
          ? prev.items
          : prev.items.filter((item) => item.localId !== localId),
    }));
  }

  function handleChangeItemName(localId: number, value: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.localId === localId ? { ...item, itemName: value } : item
      ),
    }));
  }

  function handleChangeItemAmount(localId: number, value: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.localId === localId ? { ...item, amount: value } : item
      ),
    }));
  }

  function handleChangeItemUnit(localId: number, value: CareTemplateUnit) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.localId === localId ? { ...item, unit: value } : item
      ),
    }));
  }

  function handleToggleWeekday(value: string) {
    setForm((prev) => {
      const exists = prev.fixedDaysOfWeek.includes(value);

      return {
        ...prev,
        fixedDaysOfWeek: exists
          ? prev.fixedDaysOfWeek.filter((day) => day !== value)
          : [...prev.fixedDaysOfWeek, value],
      };
    });
  }

  function validateForm() {
    if (!selectedPetId) {
      return "対象ペットを選択してください。";
    }

    if (!form.name.trim()) {
      return "セット名を入力してください。";
    }

    if (form.items.length === 0) {
      return "中身を1件以上入力してください。";
    }

    const hasEmptyItem = form.items.some((item) => !item.itemName.trim());
    if (hasEmptyItem) {
      return "中身の名前を入力してください。";
    }

    const hasInvalidAmount = form.items.some((item) => Number.isNaN(item.amount) || item.amount < 0);
    if (hasInvalidAmount) {
      return "量は0以上で入力してください。";
    }

    if (form.isFixed && form.fixedDaysOfWeek.length === 0) {
      return "固定の場合は曜日を1つ以上選択してください。";
    }

    if (form.isFixed && !form.fixedTime) {
      return "固定の場合は時刻を入力してください。";
    }

    return "";
  }

  async function handleSave() {
    setFormMessage("");
    setPageMessage("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setFormMessage(validationMessage);
      return;
    }

    const params = buildRequestFromForm(form);

    setIsSaving(true);

    try {
      if (editingTemplateId) {
        await updateCareTemplate(
          selectedPetId,
          editingTemplateId,
          params as UpdateCareTemplateRequest
        );
        setPageMessage("セットを更新しました。");
      } else {
        await createCareTemplate(selectedPetId, params);
        setPageMessage("セットを作成しました。");
      }

      handleCloseForm();
      await fetchTemplates(selectedPetId, selectedType);
    } catch (err) {
      console.error(err);
      setFormMessage("セットの保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  }

  function handleOpenDeleteConfirm(template: CareTemplate) {
    setDeleteTarget(template);
  }

  function handleCloseDeleteConfirm() {
    setDeleteTarget(null);
  }

  async function handleDeleteTemplate() {
    if (!deleteTarget || !selectedPetId) {
      return;
    }

    setPageMessage("");

    try {
      await deleteCareTemplate(selectedPetId, deleteTarget.id);
      setPageMessage("セットを削除しました。");
      setDeleteTarget(null);
      await fetchTemplates(selectedPetId, selectedType);
    } catch (err) {
      console.error(err);
      setPageMessage("セットの削除に失敗しました。");
    }
  }

  function handleBack() {
    router.push("/user/mypage");
  }

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <h1 style={{ margin: "0", fontSize: "24px", fontWeight: "700", color: "#111827" }}>食事・おやつ・薬管理</h1>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>
                  カレンダー登録時に選択する登録済みセットを管理できます。
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button type="button" onClick={handleBack} style={{ border: "1px solid #d1d5db", borderRadius: "8px", backgroundColor: "#ffffff", color: "#374151", fontWeight: "700", cursor: "pointer", padding: "10px 16px", fontSize: "14px" }}>
                  マイページへ戻る
                </button>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="メニューを開く"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", border: "none", borderRadius: "10px", backgroundColor: "#fed7aa", color: "#9a3412", cursor: "pointer" }}
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>
          </section>

          {pageMessage && (
            <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", padding: "14px 18px" }}>
              <p style={{ margin: "0", fontSize: "14px", color: "#374151", fontWeight: "700" }}>{pageMessage}</p>
            </section>
          )}

          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", padding: "20px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label htmlFor="petSelect" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#374151" }}>
                  対象ペット
                </label>

                <select
                  id="petSelect"
                  value={selectedPetId}
                  onChange={(e) => {
                    setSelectedPetId(Number(e.target.value));
                    setIsFormOpen(false);
                    setEditingTemplateId(null);
                  }}
                  style={{ width: "260px", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                  disabled={isLoadingPets || pets.length === 0}
                >
                  {pets.length === 0 ? (
                    <option value={0}>ペットが登録されていません</option>
                  ) : (
                    pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name}（{pet.type}）
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(["FOOD", "SNACK", "MEDICINE"] as CareTemplateType[]).map((type) => {
                  const isActive = selectedType === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChangeType(type)}
                      style={isActive ? { border: "1px solid #e5e7eb", borderRadius: "999px", backgroundColor: "#fff7ed", color: "#9a3412", fontWeight: "700", cursor: "pointer", padding: "8px 16px", fontSize: "14px", borderColor: "#f97316" } : { border: "1px solid #e5e7eb", borderRadius: "999px", backgroundColor: "#ffffff", color: "#374151", fontWeight: "700", cursor: "pointer", padding: "8px 16px", fontSize: "14px" }}
                    >
                      {TEMPLATE_TYPE_LABELS[type]}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "700", color: "#111827" }}>
                  {selectedPet ? `${selectedPet.name}の` : ""}
                  {TEMPLATE_TYPE_LABELS[selectedType]}セット一覧
                </h2>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>
                  ここで作成したセットは、カレンダー登録時に呼び出して明細へ反映できます。
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateForm}
                style={{ border: "none", borderRadius: "8px", padding: "10px 16px", backgroundColor: "#f97316", color: "#ffffff", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
                disabled={!selectedPetId}
              >
                <Plus size={18} />
                新規作成
              </button>
            </div>

            {isLoadingTemplates ? (
              <p style={{ margin: "18px 0 0", fontSize: "14px", color: "#6b7280" }}>セットを読み込み中です...</p>
            ) : templates.length === 0 ? (
              <p style={{ margin: "18px 0 0", fontSize: "14px", color: "#6b7280" }}>登録されているセットがありません。</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", marginTop: "18px", gap: "12px" }}>
                {templates.map((template) => (
                  <div key={template.id} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", backgroundColor: "#ffffff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                      <div>
                        <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "700", color: "#111827" }}>{template.name}</h3>

                        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#6b7280" }}>
                          {template.isFixed
                            ? `固定：${formatFixedDays(template.fixedDaysOfWeek)} ${template.fixedTime}`
                            : "不定"}
                        </p>

                        {template.memo && (
                          <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#374151" }}>{template.memo}</p>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                          type="button"
                          onClick={() => handleEditTemplate(template)}
                          style={{ border: "1px solid #d1d5db", borderRadius: "8px", backgroundColor: "#ffffff", color: "#374151", fontWeight: "700", cursor: "pointer", padding: "8px 12px", fontSize: "13px" }}
                        >
                          編集
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDeleteConfirm(template)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 12px", backgroundColor: "#fef2f2", color: "#b91c1c", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                        >
                          <Trash2 size={15} />
                          削除
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {template.items.map((item) => (
                        <span key={item.id} style={{ display: "inline-block", borderRadius: "999px", padding: "5px 10px", backgroundColor: "#f3f4f6", color: "#374151", fontSize: "12px", fontWeight: "700" }}>
                          {item.itemName} {item.amount}
                          {item.unit}
                        </span>
                      ))}
                    </div>

                    {template.imageKey && (
                      <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#6b7280" }}>
                        画像キー：{template.imageKey}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {isFormOpen && (
            <section style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", padding: "24px" }}>
              <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "700", color: "#111827" }}>
                {editingTemplateId ? "セット編集" : "セット新規作成"}
              </h2>

              {formMessage && (
                <div style={{ marginTop: "16px", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 12px", backgroundColor: "#fef2f2", color: "#b91c1c", fontSize: "14px", fontWeight: "700" }}>
                  {formMessage}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", marginTop: "20px", gap: "18px" }}>
                <div>
                  <label htmlFor="templateType" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#374151" }}>
                    種類
                  </label>
                  <select
                    id="templateType"
                    value={form.templateType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        templateType: e.target.value as CareTemplateType,
                      }))
                    }
                    style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                  >
                    {(["FOOD", "SNACK", "MEDICINE"] as CareTemplateType[]).map((type) => (
                      <option key={type} value={type}>
                        {TEMPLATE_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="templateName" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#374151" }}>
                    セット名
                  </label>
                  <input
                    id="templateName"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="例：いつものごはん"
                    style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label htmlFor="imageKey" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#374151" }}>
                    画像キー
                  </label>
                  <input
                    id="imageKey"
                    value={form.imageKey}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, imageKey: e.target.value }))
                    }
                    placeholder="S3連携前なので仮入力欄"
                    style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#374151" }}>中身</label>

                    <button
                      type="button"
                      onClick={handleAddItem}
                      style={{ border: "1px solid #fed7aa", borderRadius: "8px", padding: "8px 12px", backgroundColor: "#fff7ed", color: "#9a3412", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
                    >
                      明細を追加
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {form.items.map((item, index) => (
                      <div key={item.localId} style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 44px", gap: "8px", alignItems: "center" }}>
                        <input
                          value={item.itemName}
                          onChange={(e) =>
                            handleChangeItemName(item.localId, e.target.value)
                          }
                          placeholder="例：フェレットペレット"
                          aria-label={`明細${index + 1}の名前`}
                          style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                        />

                        <input
                          type="number"
                          min={0}
                          value={item.amount}
                          onChange={(e) =>
                            handleChangeItemAmount(item.localId, Number(e.target.value))
                          }
                          placeholder="量"
                          aria-label={`明細${index + 1}の量`}
                          style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                        />

                        <select
                          value={item.unit}
                          onChange={(e) =>
                            handleChangeItemUnit(
                              item.localId,
                              e.target.value as CareTemplateUnit
                            )
                          }
                          aria-label={`明細${index + 1}の単位`}
                          style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                        >
                          <option value="g">g</option>
                          <option value="cc">cc</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.localId)}
                          aria-label="明細を削除"
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", border: "1px solid #fecaca", borderRadius: "8px", backgroundColor: "#fef2f2", color: "#b91c1c", cursor: "pointer" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px", backgroundColor: "#ffffff" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", color: "#111827" }}>
                    <input
                      type="checkbox"
                      checked={form.isFixed}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isFixed: e.target.checked,
                          fixedDaysOfWeek: e.target.checked
                            ? prev.fixedDaysOfWeek
                            : [],
                          fixedTime: e.target.checked ? prev.fixedTime || "09:00" : "",
                        }))
                      }
                    />
                    <span>固定スケジュールにする</span>
                  </label>

                  {form.isFixed && (
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "16px", gap: "14px" }}>
                      <div>
                        <p style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#374151", margin: "0 0 8px" }}>曜日</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {WEEKDAY_OPTIONS.map((day) => {
                            const isChecked = form.fixedDaysOfWeek.includes(day.value);

                            return (
                              <button
                                key={day.value}
                                type="button"
                                onClick={() => handleToggleWeekday(day.value)}
                                style={isChecked ? { border: "1px solid #e5e7eb", borderRadius: "999px", backgroundColor: "#fff7ed", color: "#9a3412", fontWeight: "700", cursor: "pointer", padding: "7px 12px", fontSize: "13px", borderColor: "#f97316" } : { border: "1px solid #e5e7eb", borderRadius: "999px", backgroundColor: "#ffffff", color: "#374151", fontWeight: "700", cursor: "pointer", padding: "7px 12px", fontSize: "13px" }}
                              >
                                {day.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="fixedTime" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#374151" }}>
                          時刻
                        </label>
                        <input
                          id="fixedTime"
                          type="time"
                          value={form.fixedTime}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              fixedTime: e.target.value,
                            }))
                          }
                          style={{ width: "160px", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="memo" style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#374151" }}>
                    メモ
                  </label>
                  <textarea
                    id="memo"
                    value={form.memo}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, memo: e.target.value }))
                    }
                    rows={3}
                    placeholder="補足があれば入力してください"
                    style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", backgroundColor: "#ffffff", color: "#111827", fontSize: "14px", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    style={{ border: "1px solid #d1d5db", borderRadius: "8px", backgroundColor: "#ffffff", color: "#374151", fontWeight: "700", cursor: "pointer", padding: "10px 16px", fontSize: "14px" }}
                    disabled={isSaving}
                  >
                    キャンセル
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    style={{ border: "none", borderRadius: "8px", padding: "10px 16px", backgroundColor: "#f97316", color: "#ffffff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
                    disabled={isSaving}
                  >
                    {isSaving ? "保存中..." : "保存する"}
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {deleteTarget && (
        <div style={{ position: "fixed", inset: "0", backgroundColor: "rgba(0, 0, 0, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", zIndex: "60" }}>
          <div style={{ width: "100%", maxWidth: "420px", borderRadius: "12px", padding: "20px", backgroundColor: "#ffffff", boxShadow: "0 16px 40px rgba(0, 0, 0, 0.2)" }} role="dialog" aria-modal="true">
            <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "700", color: "#111827" }}>セットを削除しますか？</h3>
            <p style={{ margin: "10px 0 0", fontSize: "14px", color: "#4b5563", lineHeight: "1.7" }}>
              「{deleteTarget.name}」を削除します。すでに作成済みのカレンダー記録は残す想定です。
            </p>

            <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={handleCloseDeleteConfirm}
                style={{ border: "1px solid #d1d5db", borderRadius: "8px", backgroundColor: "#ffffff", color: "#374151", fontWeight: "700", cursor: "pointer", padding: "10px 16px", fontSize: "14px" }}
              >
                キャンセル
              </button>

              <button
                type="button"
                onClick={handleDeleteTemplate}
                style={{ border: "none", borderRadius: "8px", padding: "10px 16px", backgroundColor: "#dc2626", color: "#ffffff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}