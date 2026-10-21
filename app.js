// 1. تهيئة Supabase
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'sb_publishable_xc2on7X7FKcJ0pytTH5isg_W8bAEblm';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. مصفوفة المنتجات في الواجهة
const products = [
    // قسم الملابس
    { id: 1, title: 'قميص رجالي أنيق', category: 'clothing', price: 25.99, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500' },
    { id: 2, title: 'جاكيت شتوي عصري', category: 'clothing', price: 59.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' },

    // قسم الأجهزة الكهربائية
    { id: 3, title: 'مخلاط كهربائي ذكي', category: 'electronics', price: 75.50, image: 'https://images.unsplash.com/photo-1570222094114-d074f7e1e6e0?w=500' },
    { id: 4, title: 'صانعة قهوة إسباريصو', category: 'electronics', price: 120.00, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500' },

    // قسم الهواتف والحواسيب
    { id: 5, title: 'هاتف ذكي برو ماكس', category: 'phones_computers', price: 899.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500' },
    { id: 6, title: 'حاسوب محمول للأعمال', category: 'phones_computers', price: 1199.00, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500' },

    // قسم الأحذية الرياضية
    { id: 7, title: 'حذاء جري احترافي', category: 'sports_shoes', price: 65.00, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
    { id: 8, title: 'حذاء رياضي كاجوال', category: 'sports_shoes', price: 50.00, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500' }
];

// 3. عرض المنتجات في الصفحة
function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = items.map(prod => `
        <div class="product-card">
            <img src="${prod.image}" alt="${prod.title}">
            <div class="product-info">
                <h4>${prod.title}</h4>
                <div class="product-price">$${prod.price}</div>
            </div>
        </div>
    `).join('');
}

// تصفية حسب القسم
function filterCategory(category) {
    const categoryTitles = {
        'all': 'جميع المنتجات',
        'clothing': 'قسم الملابس',
        'electronics': 'قسم الأجهزة الكهربائية',
        'phones_computers': 'قسم الهواتف والحواسيب',
        'sports_shoes': 'قسم الأحذية الرياضية'
    };

    document.getElementById('categoryTitle').innerText = categoryTitles[category];

    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// 4. إدلاءات فتح وإغلاق النوافذ المنبثقة
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// 5. ربط إنشاء حساب جديد بـ Supabase
async function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        alert('خطأ في إنشاء الحساب: ' + error.message);
    } else {
        alert('تم إنشاء الحساب بنجاح!');
        closeModal('signupModal');
    }
}

// 6. ربط تسجيل الدخول بـ Supabase
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert('خطأ في تسجيل الدخول: ' + error.message);
    } else {
        alert('أهلاً بك! تم تسجيل الدخول بنجاح.');
        closeModal('loginModal');
        updateUIOnLogin(data.user);
    }
}

// تحديث الواجهة عند تسجيل الدخول
function updateUIOnLogin(user) {
    document.getElementById('authSection').innerHTML = `
        <span>مرحباً، ${user.email}</span>
        <button onclick="handleLogout()" class="btn-login">خروج</button>
    `;
}

// تسجيل الخروج
async function handleLogout() {
    await supabase.auth.signOut();
    location.reload();
}

// تشغيل عرض المنتجات عند تحميل الصفحة
window.onload = () => {
    renderProducts(products);
};
