import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useMenuController from "../../pages/Admin/Menu/Menus.js";
import { useCategoryController } from "../../pages/Admin/Category/Category.js";
import salad from "../../../components/assets/salad.jpg";
import chickenburger from "../../../components/assets/chickenburger.jpg";
import veg from "../../../components/assets/vegsand.jpg";
import chickenfrid from "../../../components/assets/chickenfrid.jpg";
import donot from "../../../components/assets/donot.jpg";
import sandwitch from "../../../components/assets/sandwitch.jpg";
import continentaldish from "../../../components/assets/continentadish.jpg";
import continentaldishes from "../../../components/assets/continentaldishes.jpeg";

const imageMap = {
  "salad.jpg": salad,
  "chickenburger.jpg": chickenburger,
  "vegsand.jpg": veg,
  "chickenfrid.jpg": chickenfrid,
  "donot.jpg": donot,
  "sandwitch.jpg": sandwitch,
  "continentaldishes.jpeg": continentaldish,
  "continentadish.jpg": continentaldishes,
};

const GuestMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [tableNo, setTableNo] = useState("");
  const [guestTableId, setGuestTableId] = useState("");

  const { placeOrder } = useMenuController();
  const { categories: adminMenus } = useCategoryController();

  useEffect(() => {
    // Read table info saved during Guest-Login
    const tableLabel = localStorage.getItem("guest_table_number");
    const tableId = localStorage.getItem("guest_table_id");

    if (tableLabel && tableLabel.startsWith("Table_")) {
      const num = Number(tableLabel.replace("Table_", ""));
      if (!Number.isNaN(num)) setTableNo(num);
    }
    if (tableId) {
      setGuestTableId(tableId);
    }
    // Fallback: parse from current URL if not present in storage
    if (!tableLabel || !tableId) {
      const params = new URLSearchParams(location.search);
      const t = params.get("table");
      const id = params.get("id");
      if (t && t.startsWith("Table_")) {
        const num = Number(t.replace("Table_", ""));
        if (!Number.isNaN(num)) {
          setTableNo(num);
          localStorage.setItem("guest_table_number", t);
        }
      }
      if (id) {
        setGuestTableId(id);
        localStorage.setItem("guest_table_id", id);
      }
    }
  }, [location.search]);

  // Build categories dynamically from backend menus
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    (adminMenus || []).forEach((m) => {
      if (m.meal_type) set.add(m.meal_type);
    });
    return Array.from(set);
  }, [adminMenus]);

  // Normalize backend menu items to Guest card fields
  const menuItems = useMemo(() => {
    return (adminMenus || []).map((m) => ({
      id: m.id,
      name: m.item_name || m.name || "Item",
      price: m.price || 0,
      category: m.meal_type || m.category || "Other",
      image: m.image,
      raw: m,
    }));
  }, [adminMenus]);

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const getImage = (image) => (imageMap[image] ? imageMap[image] : image);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === itemId ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const subtotal = cart.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * i.qty,
    0
  );
  // const tax = subtotal * 0.08;
  // const total = subtotal + tax;

  const total = subtotal;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Please add items to cart!");
      return;
    }
    if (!tableNo) {
      toast.error("Missing table number. Please rescan QR.");
      return;
    }

    try {
      const payload = {
        order_code: `ORD-${Date.now()}`,
        table_no: Number(tableNo),
        order_type: "dine-in",
        // Map to backend expected shape
        items: cart.map((i) => ({
          item_name: i.name || i.item_name,
          quantity: i.qty,
          price: Number(i.price) || 0,
        })),
      };
      await placeOrder(payload);

      // Persist placed items for this session so Checkout can show ALL orders
      const prevPlaced = JSON.parse(
        localStorage.getItem("guestPlacedItems") || "[]"
      );
      const currentPlaced = cart.map((i) => ({
        id: i.id,
        name: i.name,
        price: Number(i.price) || 0,
        qty: i.qty,
      }));
      const merged = [...prevPlaced, ...currentPlaced];
      localStorage.setItem("guestPlacedItems", JSON.stringify(merged));

      toast.success("✅ Order sent to kitchen!");
      setCart([]);
    } catch (e) {
      toast.error("Failed to place order. Try again.");
    }
  };

  const handleCheckout = () => {
    const placed = JSON.parse(localStorage.getItem("guestPlacedItems") || "[]");
    const current = cart.map((i) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price) || 0,
      qty: i.qty,
    }));

    const combined = [...placed, ...current];
    if (combined.length === 0) {
      toast.error("No items to checkout!");
      return;
    }

    // Optionally collapse duplicates by item id
    const collapsed = Object.values(
      combined.reduce((acc, item) => {
        const key = String(item.id);
        if (!acc[key]) acc[key] = { ...item };
        else acc[key].qty += item.qty;
        return acc;
      }, {})
    );

    localStorage.setItem("guestOrders", JSON.stringify(collapsed));
    navigate("/guest-checkout");
  };

  return (
    <div className="flex flex-col p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 relative">
      {/* Categories */}
      <div className="flex space-x-4 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap text-sm md:text-base font-medium ${
              selectedCategory === cat
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-40">
        {filteredItems.map((item) => {
          const inCart = cart.find((c) => c.id === item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition relative"
            >
              <img
                src={getImage(item.image)}
                alt={item.name}
                className="w-full h-28 sm:h-36 object-cover rounded-t-xl"
              />

              {/* Floating + / - controls */}
              <div className="absolute top-2 right-2 bg-gray-900/70 text-white flex items-center space-x-2 rounded-full px-2 py-1 text-xs shadow">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-2 font-bold hover:text-gray-300"
                  disabled={!inCart}
                >
                  −
                </button>
                <span>{inCart?.qty || 0}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="px-2 font-bold hover:text-gray-300"
                >
                  +
                </button>
              </div>

              <div className="p-3 text-center">
                <h2 className="font-semibold text-sm sm:text-base">
                  {item.name}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  ₹ {item.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Card */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-4 right-4 bg-white shadow-lg p-3 rounded-lg text-center z-20">
          <p className="font-semibold text-sm">
            {/* Subtotal: ₹{subtotal.toFixed(2)} | Tax: ₹{tax.toFixed(2)} */}
            Subtotal: ₹{subtotal.toFixed(2)}
            {/* | Tax: ₹{tax.toFixed(2)} */}
          </p>
          <p className="font-bold text-base">Total: ₹{total.toFixed(2)}</p>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex z-30">
        <button
          onClick={handlePlaceOrder}
          className="flex-1 bg-purple-600 text-white py-3 rounded-none"
        >
          Order Now
        </button>
        <button
          onClick={handleCheckout}
          className="flex-1 bg-green-600 text-white py-3 rounded-none"
        >
          Checkout
        </button>
      </footer>
    </div>
  );
};

export default GuestMenu;
