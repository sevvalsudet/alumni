// models/userModel.js
// 🎓 MVC Mimarisi - Model Katmanı (User Model)
// Veritabanı olmadan (In-Memory) çalışan ve tüm CRUD fonksiyonlarını içeren model.

let users = [
    { id: 1, name: "Şevval Sude", role: "Student", department: "Computer Engineering", company: null },
    { id: 2, name: "Sude", role: "Alumni", department: "Computer Engineering", company: "Google" },
    { id: 3, name: "Şevval", role: "Alumni", department: "Software Engineering", company: "Microsoft" }
];

const UserModel = {
    // 📖 [READ] Tüm kullanıcıları getir
    findAll: () => {
        return users;
    },

    // 🔍 [READ] ID numarasına göre tek bir kullanıcı getir
    findById: (id) => {
        return users.find(u => u.id === Number(id)) || null;
    },

    // ➕ [CREATE] Yeni bir kullanıcı oluştur
    create: (userData) => {
        const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const newUser = {
            id: nextId,
            name: userData.name,
            role: userData.role,
            department: userData.department || null,
            company: userData.company || null
        };
        users.push(newUser);
        return newUser;
    },

    // ✏️ [UPDATE - PUT] Kullanıcıyı tamamen güncelle
    update: (id, updateData) => {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) return null;

        users[index] = {
            id: Number(id),
            name: updateData.name || users[index].name,
            role: updateData.role || users[index].role,
            department: updateData.department || null,
            company: updateData.company || null
        };
        return users[index];
    },

    // 🩹 [UPDATE - PATCH] Kullanıcıyı kısmen güncelle (Sadece gelen alanları değiştir)
    patch: (id, partialData) => {
        const user = users.find(u => u.id === Number(id));
        if (!user) return null;

        Object.assign(user, partialData);
        return user;
    },

    // 🗑️ [DELETE] Kullanıcıyı sistemden sil
    delete: (id) => {
        const index = users.findIndex(u => u.id === Number(id));
        if (index === -1) return null;

        const deletedUser = users.splice(index, 1)[0];
        return deletedUser;
    }
};

module.exports = UserModel;
