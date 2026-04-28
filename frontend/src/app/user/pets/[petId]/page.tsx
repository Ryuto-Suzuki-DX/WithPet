"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import SideMenu from "@/app/user/sideMenu/sideMenu";

type Pet = {
  id: number;
  name: string;
  type: string;
  birthDate: string;
  sex: string;
};

type CalendarCell = {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
};

type WeekStartsOn = "sunday" | "monday";

// 仮データ
const mockPets: Pet[] = [
  {
    id: 1,
    name: "もも",
    type: "フェレット",
    birthDate: "2023-05-01",
    sex: "メス",
  },
  {
    id: 2,
    name: "レオ",
    type: "猫",
    birthDate: "2022-08-15",
    sex: "オス",
  },
  {
    id: 3,
    name: "ココ",
    type: "犬",
    birthDate: "2021-11-20",
    sex: "メス",
  },
];

const WEEK_LABELS: Record<WeekStartsOn, string[]> = {
  sunday: ["日", "月", "火", "水", "木", "金", "土"],
  monday: ["月", "火", "水", "木", "金", "土", "日"],
};

function formatMonthLabel(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function formatBirthDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}/${month}/${day}`;
}

function calculateAge(dateString: string) {
  const birthDate = new Date(dateString);
  const today = new Date();

  if (Number.isNaN(birthDate.getTime())) {
    return "-";
  }

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasNotHadBirthdayYet =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayYet) {
    age -= 1;
  }

  return `${age}歳`;
}

function createCalendarCells(baseDate: Date, weekStartsOn: WeekStartsOn): CalendarCell[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayWeek = firstDayOfMonth.getDay();

  const offset = weekStartsOn === "monday"
    ? (firstDayWeek + 6) % 7
    : firstDayWeek;

  const calendarStartDate = new Date(year, month, 1 - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStartDate);
    date.setDate(calendarStartDate.getDate() + index);

    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    };
  });
}

export default function UserMyPage() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 将来、曜日開始切替を入れやすいよう state にしておく
  const [weekStartsOn] = useState<WeekStartsOn>("sunday");

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const calendarCells = useMemo(() => {
    return createCalendarCells(currentMonth, weekStartsOn);
  }, [currentMonth, weekStartsOn]);

  const weekLabels = WEEK_LABELS[weekStartsOn];

  function handleOpenMenu() {
    setIsMenuOpen(true);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  function handlePrevMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function handlePetClick(petId: number) {
    router.push(`/user/pets/${petId}`);
  }

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={handleCloseMenu} />

      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  マイページ
                </h1>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  自分のペット情報とカレンダーを確認できます
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenMenu}
                aria-label="メニューを開く"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "42px",
                  height: "42px",
                  border: "none",
                  borderRadius: "10px",
                  backgroundColor: "#fed7aa",
                  color: "#9a3412",
                  cursor: "pointer",
                }}
              >
                <Menu size={22} />
              </button>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            <section
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    自分のペット
                  </h2>
                  <p
                    style={{
                      margin: "8px 0 0 0",
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    ペットをクリックすると詳細画面へ進みます
                  </p>
                </div>
              </div>

              {mockPets.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  登録されているペットはありません。
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {mockPets.map((pet) => (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => handlePetClick(pet.id)}
                      style={{
                        width: "100%",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "16px",
                        backgroundColor: "#ffffff",
                        textAlign: "left",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          {pet.name}
                        </h3>

                        <span
                          style={{
                            display: "inline-block",
                            borderRadius: "999px",
                            padding: "6px 10px",
                            backgroundColor: "#ffedd5",
                            color: "#9a3412",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          {pet.type}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: "10px 16px",
                          fontSize: "14px",
                          color: "#374151",
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 700 }}>誕生日：</span>
                          {formatBirthDate(pet.birthDate)}
                        </div>

                        <div>
                          <span style={{ fontWeight: 700 }}>年齢：</span>
                          {calculateAge(pet.birthDate)}
                        </div>

                        <div>
                          <span style={{ fontWeight: 700 }}>性別：</span>
                          {pet.sex}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    カレンダー
                  </h2>
                  <p
                    style={{
                      margin: "8px 0 0 0",
                      fontSize: "14px",
                      color: "#6b7280",
                    }}
                  >
                    月送り対応済みです。日付クリックや曜日開始切替は後で拡張できます。
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    aria-label="前の月へ"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "38px",
                      height: "38px",
                      border: "none",
                      borderRadius: "8px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div
                    style={{
                      minWidth: "120px",
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {formatMonthLabel(currentMonth)}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="次の月へ"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "38px",
                      height: "38px",
                      border: "none",
                      borderRadius: "8px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      cursor: "pointer",
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                {weekLabels.map((label) => (
                  <div
                    key={label}
                    style={{
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#6b7280",
                      padding: "8px 0",
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: "8px",
                }}
              >
                {calendarCells.map((cell, index) => {
                  const isToday = new Date().toDateString() === cell.date.toDateString();

                  return (
                    <div
                      key={`${cell.date.toDateString()}-${index}`}
                      style={{
                        minHeight: "72px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        padding: "10px",
                        backgroundColor: cell.isCurrentMonth ? "#ffffff" : "#f9fafb",
                        color: cell.isCurrentMonth ? "#111827" : "#9ca3af",
                        boxShadow: isToday ? "inset 0 0 0 2px #f97316" : "none",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: isToday ? 700 : 500,
                          color: isToday ? "#ea580c" : "inherit",
                        }}
                      >
                        {cell.dayNumber}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}