import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";

const API_URL = "http://192.168.1.11:3000";

const INITIAL_DATA = [
  {
    id: 1,
    judul: "Makan siang",
    tanggal: "10/09/2026",
    kategori: "Makan",
    nominal: 22000,
    catatan: "Makan siang",
  },
  {
    id: 2,
    judul: "Bensin",
    tanggal: "10/09/2026",
    kategori: "Transport",
    nominal: 15000,
    catatan: "Isi bensin",
  },
  {
    id: 3,
    judul: "Buku Catatan",
    tanggal: "10/09/2026",
    kategori: "Pendidikan",
    nominal: 25000,
    catatan: "Beli buku catatan",
  },
];

const CATEGORIES = ["Makan", "Transport", "Pendidikan"];

// =========================
// FORMAT RUPIAH
// =========================
const formatRupiah = (number) => {
  return "Rp " + Number(number).toLocaleString("id-ID");
};

// =========================
// SUB-KOMPONEN DI LUAR APP
// =========================
const Header = ({ title, back = true, onBack }) => {
  return (
    <View style={styles.header}>
      {back ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const MainButton = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.mainButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.mainButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA6B2"
        keyboardType={keyboardType}
      />
    </View>
  );
};

// =========================
// SCREEN COMPONENTS
// =========================
const ListScreen = ({ data, openAdd, openDetail, setScreen }) => {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <Text style={styles.pageTitle}>Daftar pengeluaran</Text>

        <MainButton title="Tambah pengeluaran" onPress={openAdd} />

        <View style={styles.searchBox}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Pencarian"
            placeholderTextColor="#9AA6B2"
            style={styles.searchInput}
          />
        </View>

        {filteredData.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyBox}
            onPress={() => setScreen("empty")}
          >
            <Text style={styles.emptyText}>Belum ada pengeluaran</Text>
          </TouchableOpacity>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {filteredData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => openDetail(item)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.judul}</Text>
                  <Text style={styles.cardLink}>Lihat detail</Text>
                </View>

                <Text style={styles.cardDate}>{item.tanggal}</Text>
                <Text style={styles.cardCategory}>{item.kategori}</Text>
                <Text style={styles.cardNominal}>
                  {formatRupiah(item.nominal)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

 const AddScreen = ({ form, setForm, setScreen, saveData }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header title="Tambah pengeluaran" onBack={() => setScreen("list")} />

        <Input
          label="Judul"
          value={form.judul}
          onChangeText={(value) => setForm({ ...form, judul: value })}
          placeholder="Masukkan Judul"
        />

        <Input
          label="Nominal"
          value={form.nominal}
          onChangeText={(value) => setForm({ ...form, nominal: value })}
          placeholder="Masukkan nominal"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.selectInput}
          onPress={() => setScreen("category")}
        >
          <Text style={styles.label}>Kategori opsional</Text>

          <Text
            style={[
              styles.selectText,
              !form.kategori && styles.placeholderText,
            ]}
          >
            {form.kategori || "Pilih kategori"}
          </Text>
        </TouchableOpacity>

        <Input
          label="Catatan"
          value={form.catatan}
          onChangeText={(value) => setForm({ ...form, catatan: value })}
          placeholder="Masukkan catatan"
        />

        <View style={styles.bottomArea}>
          <Text style={styles.smallText}>Tanggal otomatis saat disimpan</Text>
          <MainButton title="Simpan" onPress={saveData} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const CategoryScreen = ({ form, chooseCategory, setScreen }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header title="Pilih kategori" onBack={() => setScreen("list")} />

        <Text style={styles.description}>Pilih kategori untuk pengeluaran</Text>

        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryOption}
            onPress={() => chooseCategory(category)}
          >
            <View style={styles.radio}>
              {form.kategori === category && (
                <View style={styles.radioActive} />
              )}
            </View>

            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomArea}>
          <MainButton title="Pilih Kategori" onPress={() => setScreen("add")} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const ErrorScreen = ({ form, setForm, saveData, setScreen }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Tambah pengeluaran</Text>

        <Header
          title=""
          onBack={() => setScreen("list")}
        />

        <Input
          label="Judul"
          value={form.judul}
          onChangeText={(value) =>
            setForm({ ...form, judul: value })
          }
          placeholder="Masukan Judul"
        />

        {!form.judul && (
          <Text style={styles.fieldError}>
            Judul wajib diisi
          </Text>
        )}

        <Input
          label="Nominal rupiah"
          value={form.nominal}
          onChangeText={(value) =>
            setForm({ ...form, nominal: value })
          }
          placeholder="Masukan Nominal"
          keyboardType="numeric"
        />

        {!form.nominal && (
          <Text style={styles.fieldError}>
            Nominal harus positif
          </Text>
        )}

        <Input
          label="Kategori opsional"
          value={form.kategori}
          onChangeText={(value) =>
            setForm({ ...form, kategori: value })
          }
          placeholder="Pilih kategori"
        />

        <Input
          label="Catatan"
          value={form.catatan}
          onChangeText={(value) =>
            setForm({ ...form, catatan: value })
          }
          placeholder="Masukkan catatan"
        />

        <View style={styles.bottomArea}>
          <Text style={styles.smallText}>
            Tanggal otomatis dari server
          </Text>

          <MainButton
            title="Simpan"
            onPress={saveData}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const SavingScreen = ({ setScreen }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header title="Tambah pengeluaran" onBack={() => setScreen("list")} />

        <View style={styles.savingBox}>
          <Text style={styles.savingText}>Menyimpan...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const DetailScreen = ({ selectedData, openEdit, openDelete, setScreen }) => {
  if (!selectedData) {
    setScreen("notFound");
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header title="Detail Pengeluaran" onBack={() => setScreen("list")} />

        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.detailTitle}>{selectedData.judul}</Text>
              <Text style={styles.detailNominal}>
                {formatRupiah(selectedData.nominal)}
              </Text>
              <Text style={styles.detailCategory}>{selectedData.kategori}</Text>
              <Text style={styles.detailNote}>{selectedData.catatan}</Text>
            </View>

            <Text style={styles.detailDate}>{selectedData.tanggal}</Text>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <MainButton title="Edit" onPress={openEdit} />

          <TouchableOpacity style={styles.deleteButton} onPress={openDelete}>
            <Text style={styles.deleteText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const EditScreen = ({ form, setForm, saveEdit, setScreen }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header title="Edit Pengeluaran" onBack={() => setScreen("list")} />

        <Input
          label="Judul"
          value={form.judul}
          onChangeText={(value) => setForm({ ...form, judul: value })}
          placeholder="Masukkan Judul"
        />

        <Input
          label="Nominal rupiah"
          value={form.nominal}
          onChangeText={(value) => setForm({ ...form, nominal: value })}
          placeholder="Rp 0"
          keyboardType="numeric"
        />

        <Input
          label="Kategori opsional"
          value={form.kategori}
          onChangeText={(value) => setForm({ ...form, kategori: value })}
          placeholder="Pilih kategori"
        />

        <Input
          label="Catatan"
          value={form.catatan}
          onChangeText={(value) => setForm({ ...form, catatan: value })}
          placeholder="Masukkan catatan"
        />

        <View style={styles.bottomArea}>
          <Text style={styles.smallText}>Tanggal otomatis saat diperbarui</Text>

          <MainButton title="Simpan" onPress={saveEdit} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const DeleteConfirmScreen = ({ selectedData, deleteData, setScreen }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Konfirmasi Hapus</Text>

        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>
            Apakah kamu yakin ingin menghapus data ini?
          </Text>

          <Text style={styles.confirmTitle}>"{selectedData?.judul}"</Text>
        </View>

        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setScreen("detail")}
          >
            <Text style={styles.secondaryText}>Batal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={deleteData}>
            <Text style={styles.deleteText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const EmptyScreen = ({ openAdd }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Daftar pengeluaran</Text>

        <MainButton title="Tambah pengeluaran" onPress={openAdd} />

        <View style={styles.emptyBoxLarge}>
          <Text style={styles.emptyText}>Belum ada pengeluaran</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const FailedScreen = ({ setScreen }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header title="Tambah pengeluaran" onBack={() => setScreen("list")} />

        <View style={styles.failedBox}>
          <Text style={styles.failedText}>Gagal memuat data pengeluaran</Text>
        </View>

        <View style={styles.bottomArea}>
          <MainButton title="Coba lagi" onPress={() => setScreen("add")} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const NotFoundScreen = ({ openAdd }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Daftar pengeluaran</Text>

        <MainButton title="Tambah pengeluaran" onPress={openAdd} />

        <View style={styles.notFoundBox}>
          <Text style={styles.notFoundText}>Data tidak ditemukan</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// =========================================================
// MAIN APP COMPONENT
// =========================================================
export default function App() {
  const [screen, setScreen] = useState("list");
  const [data, setData] = useState(INITIAL_DATA);
    useEffect(() => {
    fetch(`${API_URL}/pengeluaran`)
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.log("Gagal mengambil data:", error);
      });
  }, []);
  const [selectedData, setSelectedData] = useState(null);
  const [form, setForm] = useState({
    judul: "",
    nominal: "",
    kategori: "",
    catatan: "",
  });

  const [error, setError] = useState("");
  const [, setIsSaving] = useState(false);

  const openAdd = () => {
    setForm({
      judul: "",
      nominal: "",
      kategori: "",
      catatan: "",
    });

    setError("");
    setScreen("add");
  };

  const chooseCategory = (category) => {
    setForm({
      ...form,
      kategori: category,
    });

    setScreen("add");
  };

  const saveData = async () => {
  if (!form.judul || !form.nominal || !form.kategori) {
    setError("Mohon isi semua data yang diperlukan.");
    setScreen("error");
    return;
  }

  setError("");
  setIsSaving(true);
  setScreen("saving");

  const kategoriId = {
    Pendidikan: 1,
    Makanan: 2,
    Makan: 2,
    Transport: 3,
    Hiburan: 4,
  };

  try {
    const response = await fetch(`${API_URL}/pengeluaran`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        judul: form.judul,
        nominal: Number(form.nominal),
        tanggal: new Date().toISOString().split("T")[0],
        catatan: form.catatan || "-",
        id_kategori: kategoriId[form.kategori],
      }),
    });

    const result = await response.json();

    console.log("Hasil simpan:", result);

    if (!response.ok || result.error) {
      throw new Error(result.error || "Gagal menyimpan data");
    }

    const getResponse = await fetch(`${API_URL}/pengeluaran`);
    const updatedData = await getResponse.json();

    setData(updatedData);
    setIsSaving(false);
    setScreen("list");
  } catch (error) {
    console.log("Gagal menyimpan:", error);

    setIsSaving(false);
    setError("Data gagal disimpan.");
    setScreen("error");
  }
};

  const openDetail = (item) => {
    setSelectedData(item);
    setScreen("detail");
  };

  const openEdit = () => {
    if (!selectedData) return;

    setForm({
      judul: selectedData.judul,
      nominal: String(selectedData.nominal),
      kategori: selectedData.kategori,
      catatan: selectedData.catatan,
    });

    setScreen("edit");
  };

  const saveEdit = () => {
    if (!form.judul || !form.nominal || !form.kategori) {
      setError("Mohon isi semua data yang diperlukan.");
      setScreen("error");
      return;
    }

    const updated = {
      ...selectedData,
      judul: form.judul,
      nominal: Number(form.nominal),
      kategori: form.kategori,
      catatan: form.catatan || "-",
    };

    setData(data.map((item) => (item.id === selectedData.id ? updated : item)));
    setSelectedData(updated);
    setScreen("list");
  };

  const openDelete = () => {
    setScreen("deleteConfirm");
  };

  const deleteData = () => {
    if (!selectedData) return;

    setData(data.filter((item) => item.id !== selectedData.id));
    setSelectedData(null);
    setScreen("list");
  };

  // ROUTING SCREEN
  if (screen === "list") {
    return (
      <ListScreen
        data={data}
        openAdd={openAdd}
        openDetail={openDetail}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "add") {
    return (
      <AddScreen
        form={form}
        setForm={setForm}
        setScreen={setScreen}
        saveData={saveData}
      />
    );
  }

  if (screen === "category") {
    return (
      <CategoryScreen
        form={form}
        chooseCategory={chooseCategory}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "error") {
    return (
      <ErrorScreen
        form={form}
        setForm={setForm}
        error={error}
        saveData={saveData}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "saving") {
    return <SavingScreen setScreen={setScreen} />;
  }

  if (screen === "detail") {
    return (
      <DetailScreen
        selectedData={selectedData}
        openEdit={openEdit}
        openDelete={openDelete}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "edit") {
    return (
      <EditScreen
        form={form}
        setForm={setForm}
        saveEdit={saveEdit}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "deleteConfirm") {
    return (
      <DeleteConfirmScreen
        selectedData={selectedData}
        deleteData={deleteData}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "empty") {
    return <EmptyScreen openAdd={openAdd} />;
  }

  if (screen === "failed") {
    return <FailedScreen setScreen={setScreen} />;
  }

  if (screen === "notFound") {
    return <NotFoundScreen openAdd={openAdd} />;
  }

  return (
    <ListScreen
      data={data}
      openAdd={openAdd}
      openDetail={openDetail}
      setScreen={setScreen}
    />
  );
}

// =========================================================
// STYLE
// =========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FA",
  },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172B4D",
    marginBottom: 14,
  },

  header: {
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172B4D",
    marginTop: 12,
  },

  backButton: {
    backgroundColor: "#087F73",
    height: 36,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  mainButton: {
    height: 38,
    backgroundColor: "#087F73",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  disabledButton: {
    backgroundColor: "#B8C4CE",
  },

  searchBox: {
    height: 36,
    borderWidth: 1,
    borderColor: "#D8E0E7",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 11,
    color: "#172B4D",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4EA",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#172B4D",
  },

  cardLink: {
    fontSize: 9,
    color: "#5C6B73",
  },

  cardDate: {
    fontSize: 9,
    color: "#687780",
    marginTop: 5,
  },

  cardCategory: {
    fontSize: 9,
    color: "#687780",
    marginTop: 3,
  },

  cardNominal: {
    fontSize: 10,
    color: "#172B4D",
    marginTop: 3,
    fontWeight: "600",
  },

  inputContainer: {
    marginBottom: 12,
  },

  label: {
    fontSize: 10,
    color: "#5E6C75",
    marginBottom: 5,
  },

  input: {
    height: 38,
    borderWidth: 1,
    borderColor: "#D7E0E6",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 11,
    color: "#172B4D",
  },

  selectInput: {
    marginBottom: 12,
  },

  selectText: {
    height: 38,
    borderWidth: 1,
    borderColor: "#D7E0E6",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 11,
    fontSize: 11,
    color: "#172B4D",
  },

  placeholderText: {
    color: "#9AA6B2",
  },

  description: {
    fontSize: 10,
    color: "#7A8790",
    marginBottom: 12,
  },

  categoryOption: {
    height: 42,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4EA",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9AA6B2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  radioActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#087F73",
  },

  categoryText: {
    fontSize: 11,
    color: "#172B4D",
  },

  bottomArea: {
    marginTop: "auto",
    paddingTop: 20,
  },

  smallText: {
    fontSize: 9,
    color: "#7B8790",
    marginBottom: 7,
  },

  errorBox: {
    borderWidth: 1,
    borderColor: "#E3A4A4",
    backgroundColor: "#FFF7F7",
    borderRadius: 5,
    padding: 12,
    marginTop: 8,
  },

  errorText: {
    color: "#B53B3B",
    fontSize: 10,
    textAlign: "center",
  },

  savingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  savingText: {
    color: "#087F73",
    fontSize: 12,
    fontWeight: "600",
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4EA",
    borderRadius: 5,
    padding: 14,
  },

  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  detailTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#172B4D",
  },

  detailNominal: {
    fontSize: 11,
    color: "#172B4D",
    marginTop: 7,
  },

  detailCategory: {
    fontSize: 9,
    color: "#687780",
    marginTop: 5,
  },

  detailNote: {
    fontSize: 9,
    color: "#687780",
    marginTop: 4,
  },

  detailDate: {
    fontSize: 9,
    color: "#687780",
  },

  deleteButton: {
    height: 38,
    borderRadius: 5,
    backgroundColor: "#087F73",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  deleteText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  confirmBox: {
    marginTop: 80,
    borderWidth: 1,
    borderColor: "#DCE4EA",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
  },

  confirmText: {
    fontSize: 10,
    color: "#687780",
    textAlign: "center",
  },

  confirmTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#172B4D",
    marginTop: 8,
  },

  secondaryButton: {
    height: 38,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#087F73",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  secondaryText: {
    color: "#087F73",
    fontSize: 12,
    fontWeight: "600",
  },

  emptyBox: {
    borderWidth: 1,
    borderColor: "#DCE4EA",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 25,
    alignItems: "center",
  },

  emptyBoxLarge: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 11,
    color: "#7B8790",
  },

  failedBox: {
    marginTop: 150,
    borderWidth: 1,
    borderColor: "#E3A4A4",
    backgroundColor: "#FFF8F8",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
  },

  failedText: {
    fontSize: 10,
    color: "#B53B3B",
    textAlign: "center",
  },

  notFoundBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  notFoundText: {
    fontSize: 11,
    color: "#B53B3B",
  },

  fieldError: {
  fontSize: 9,
  color: "#D32F2F",
  marginTop: -8,
  marginBottom: 8,
},
});