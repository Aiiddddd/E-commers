/* konsisten key localStorage */
const CART_KEY = 'demo_cart_v1';
const LOVE_KEY = 'demo_love_v1';

/* helper format */
function formatRupiah(v){ return 'Rp' + Number(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

/* load/save cart: structure { id: { qty, title, price, img } } */
function loadCart(){
	try{
		const raw = localStorage.getItem(CART_KEY);
		return raw ? JSON.parse(raw) : {};
	}catch(e){ return {}; }
}
function saveCart(cart){
	localStorage.setItem(CART_KEY, JSON.stringify(cart));
	// if page has updateCartUI function or elements, call update
	if(typeof updateCartUI === 'function') updateCartUI(cart);
}

/* addToCart accepts id, qty and optional meta {title,price,img}; merges if exists */
function addToCart(id, qty=1, meta=null, triggerEl=null){
	const cart = loadCart();
	if(!cart[id]){
		cart[id] = { qty: 0, title: meta?.title || 'Produk', price: Number(meta?.price || 0), img: meta?.img || '' };
	}
	cart[id].qty = (cart[id].qty || 0) + qty;
	saveCart(cart);
	if(triggerEl && typeof animateToCart === 'function') animateToCart(triggerEl);
}

/* remove item */
function removeFromCart(id){
	const cart = loadCart();
	delete cart[id];
	saveCart(cart);
}

/* increment/decrement */
function changeQty(id, delta){
	const cart = loadCart();
	if(!cart[id]) return;
	cart[id].qty = (cart[id].qty || 0) + delta;
	if(cart[id].qty <= 0) delete cart[id];
	saveCart(cart);
}

/* if page contains cart panel elements, update them (optional) */
function updateCartUI(cartData = null){
	const cart = cartData || loadCart();
	// try to find header cart count if present
	const $cartCount = document.querySelector('.cart-count, .badge');
	if($cartCount){
		const count = Object.values(cart).reduce((s,i)=>s + (i.qty||0), 0);
		$cartCount.textContent = count;
	}
	// if there is a small cart panel container with id #cart-items, render it
	const $cartItems = document.getElementById('cart-items');
	const $cartTotal = document.getElementById('cart-total');
	if($cartItems){
		$cartItems.innerHTML = '';
		let total = 0;
		for(const id in cart){
			const item = cart[id];
			total += (item.price||0) * item.qty;
			const li = document.createElement('li');
			li.className = 'cart-item';
			li.innerHTML = `
				<img src="${item.img}" alt="${item.title}" />
				<div class="meta">
					<div style="font-weight:600">${item.title}</div>
					<div class="muted">${formatRupiah(item.price)} × ${item.qty}</div>
				</div>
				<div style="display:flex;flex-direction:column;gap:6px;">
					<button class="btn" data-action="inc" data-id="${id}">＋</button>
					<button class="btn" data-action="dec" data-id="${id}">－</button>
					<button class="btn" data-action="rm" data-id="${id}">hapus</button>
				</div>
			`;
			$cartItems.appendChild(li);
		}
		if($cartTotal) $cartTotal.textContent = formatRupiah(total);
		// attach actions
		$cartItems.querySelectorAll('button').forEach(btn=>{
			const id = btn.dataset.id;
			const act = btn.dataset.action;
			if(act==='inc') btn.onclick = ()=> changeQty(id, 1);
			if(act==='dec') btn.onclick = ()=> changeQty(id, -1);
			if(act==='rm') btn.onclick = ()=> removeFromCart(id);
		});
	}
}

/* new: LOVE (wishlist) storage */
function loadLove(){
	try{
		const raw = localStorage.getItem(LOVE_KEY);
		return raw ? JSON.parse(raw) : {};
	}catch(e){ return {}; }
}
function saveLove(love){
	localStorage.setItem(LOVE_KEY, JSON.stringify(love));
	// update UI
	updateLoveUI(love);
}

/* add/remove/toggle love items (structure: { id: { title, price, img } }) */
function addToLove(id, meta = null){
	const love = loadLove();
	if(!love[id]){
		love[id] = { title: meta?.title || 'Produk', price: Number(meta?.price || 0), img: meta?.img || '' };
	}
	saveLove(love);
}
function removeFromLove(id){
	const love = loadLove();
	delete love[id];
	saveLove(love);
}
function toggleLove(id, meta = null, triggerEl = null){
	const love = loadLove();
	if(love[id]) removeFromLove(id);
	else {
		addToLove(id, meta);
		// optional animate to love icon
		if(triggerEl){
			try{
				const $loveBtn = document.querySelector('.love-btn');
				if($loveBtn){
					// reuse fly animation but target love button
					const rect = triggerEl.getBoundingClientRect();
					const targetRect = $loveBtn.getBoundingClientRect();
					const clone = triggerEl.cloneNode(true);
					clone.className = 'fly-img';
					clone.style.left = rect.left + 'px';
					clone.style.top = rect.top + 'px';
					clone.style.width = rect.width + 'px';
					clone.style.height = rect.height + 'px';
					document.body.appendChild(clone);
					clone.getBoundingClientRect();
					const dx = targetRect.left + targetRect.width/2 - (rect.left + rect.width/2);
					const dy = targetRect.top + targetRect.height/2 - (rect.top + rect.height/2);
					requestAnimationFrame(()=> {
						clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.18) rotate(10deg)`;
						clone.style.opacity = '0.45';
					});
					clone.addEventListener('transitionend', ()=> {
						clone.remove();
						$loveBtn.classList.add('cart-shake');
						setTimeout(()=> $loveBtn.classList.remove('cart-shake'), 460);
					}, { once:true });
					setTimeout(()=> clone.remove(), 900);
				}
			}catch(e){}
		}
	}
}

/* new: update love badge in header (and optional love panel) */
function updateLoveUI(loveData = null){
	const love = loveData || loadLove();
	const $loveCount = document.querySelector('.love-count');
	if($loveCount){
		const count = Object.keys(love).length;
		$loveCount.textContent = count;
	}
	// If there is a love panel/list on page, render it similarly (not required here)
}

/* animateToCart: if defined earlier keep it; fallback no-op */
function animateToCart(imgEl){
	if(!imgEl) return;
	try{
		const rect = imgEl.getBoundingClientRect();
		const $cartBtn = document.querySelector('.cart-btn');
		if(!$cartBtn) return;

		const cartRect = $cartBtn.getBoundingClientRect();
		const clone = imgEl.cloneNode(true);
		clone.className = 'fly-img';
		clone.style.left = rect.left + 'px';
		clone.style.top = rect.top + 'px';
		clone.style.width = rect.width + 'px';
		clone.style.height = rect.height + 'px';
		clone.style.opacity = '1';
		clone.style.transform = 'translate(0,0) scale(1)';

		document.body.appendChild(clone);

		// ensure styles applied, then animate in next frame
		requestAnimationFrame(()=>{
			// reflow to ensure transition
			clone.getBoundingClientRect();
			const dx = cartRect.left + cartRect.width/2 - (rect.left + rect.width/2);
			const dy = cartRect.top + cartRect.height/2 - (rect.top + rect.height/2);
			clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.18) rotate(10deg)`;
			clone.style.opacity = '0.45';
		});

		// when transition ends, remove clone and flash cart
		let cleaned = false;
		function cleanup(){
			if(cleaned) return;
			cleaned = true;
			clone.remove();
			// add small arrival effect to cart button
			$cartBtn.classList.add('cart-shake');
			setTimeout(()=> $cartBtn.classList.remove('cart-shake'), 460);
			// small flash (if supported)
			if(typeof flashCart === 'function') flashCart();
		}
		clone.addEventListener('transitionend', cleanup, { once:true });

		// fallback in case transitionend doesn't fire
		setTimeout(cleanup, 900);
	}catch(e){
		// fail silently
	}
}

/* Attach handlers to .add-cart-btn and .wishlist-btn on page load */
document.addEventListener('DOMContentLoaded', ()=>{
	// wire add-to-cart buttons (static product cards)
	document.querySelectorAll('.add-cart-btn').forEach(btn=>{
		btn.addEventListener('click', (e)=>{
			const b = e.currentTarget;
			const id = b.dataset.id || ('p_' + Math.random().toString(36).slice(2,8));
			const meta = {
				title: b.dataset.title || b.closest('.product-card')?.querySelector('h3')?.textContent || 'Produk',
				price: Number(b.dataset.price || b.dataset['price'] || 0),
				img: b.dataset.img || b.closest('.product-card')?.querySelector('img')?.src || ''
			};
			const imgEl = b.closest('.product-card')?.querySelector('img');
			addToCart(id, 1, meta, imgEl);
			// small visual feedback
			const badge = document.querySelector('.badge, .cart-count');
			if(badge){
				badge.classList.add('pulse');
				setTimeout(()=> badge.classList.remove('pulse'), 400);
			}
		});
	});
	// update header cart count on load
	updateCartUI();

	// new: wishlist (love) binding
	document.querySelectorAll('.wishlist-btn').forEach(btn=>{
		btn.addEventListener('click', (e)=>{
			const b = e.currentTarget;
			// try to find product id/meta nearby (prefer add-cart-btn data)
			const addBtn = b.closest('.product-card')?.querySelector('.add-cart-btn');
			const id = b.dataset.id || addBtn?.dataset?.id || ('l_' + Math.random().toString(36).slice(2,8));
			const meta = {
				title: b.dataset.title || addBtn?.dataset?.title || b.closest('.product-card')?.querySelector('h3')?.textContent || 'Produk',
				price: Number(b.dataset.price || addBtn?.dataset?.price || 0),
				img: b.dataset.img || addBtn?.dataset?.img || b.closest('.product-card')?.querySelector('img')?.src || ''
			};
			const imgEl = b.closest('.product-card')?.querySelector('img') || b;
			// toggle love
			toggleLove(id, meta, imgEl);

			// visual feedback: toggle active class on the heart button
			b.classList.toggle('liked');
			const loveBadge = document.querySelector('.love-count');
			if(loveBadge){
				loveBadge.classList.add('pulse');
				setTimeout(()=> loveBadge.classList.remove('pulse'), 420);
			}
		});
	});

	// update header UI on load
	updateCartUI();
	updateLoveUI();
});
