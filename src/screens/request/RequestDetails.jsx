import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import AddressSmCard from "../../components/address-sm-card";
import Header from "../../components/header";
import PlatformLogo from "../../components/platform-logo";
import ProductCard from "../../components/product-card";
import QuotationCard from "../../components/quotation-card";
import StoreCard from "../../components/store-card";
import { Text } from "../../components/ui/text";
import { useGetPurchaseRequestByIdQuery } from "../../services/gshopApi";
import {
	formatDate,
	getRequestTypeBorderColor,
	getRequestTypeIcon,
	getRequestTypeText,
	getShortId,
	getStatusColor,
	getStatusText,
	shouldShowQuotation,
} from "../../utils/statusHandler";

export default function RequestDetails({ navigation, route }) {
	const { request } = route.params || {};
	const requestId = request?.id || route.params?.requestId;

	const [acceptedQuotations, setAcceptedQuotations] = useState({});
	const [expandedQuotations, setExpandedQuotations] = useState({});

	// Fetch purchase request detail from API - using getPurchaseRequestById
	const {
		data: requestDetails,
		isLoading,
		error,
		refetch,
	} = useGetPurchaseRequestByIdQuery(requestId, {
		skip: !requestId,
	});

	if (isLoading) {
		return (
			<View style={styles.container}>
				<Header
					title="Chi tiết yêu cầu"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
					navigation={navigation}
					showNotificationIcon={false}
					showChatIcon={false}
				/>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#1976D2" />
					<Text style={styles.loadingText}>
						Đang tải thông tin...
					</Text>
				</View>
			</View>
		);
	}

	// Show error state
	if (error || !requestDetails) {
		return (
			<View style={styles.container}>
				<Header
					title="Chi tiết yêu cầu"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
					navigation={navigation}
					showNotificationIcon={false}
					showChatIcon={false}
				/>
				<View style={styles.errorContainer}>
					<Ionicons
						name="alert-circle-outline"
						size={48}
						color="#dc3545"
					/>
					<Text style={styles.errorTitle}>
						Không thể tải thông tin
					</Text>
					<Text style={styles.errorMessage}>
						{error?.data?.message ||
							error?.message ||
							"Vui lòng thử lại sau"}
					</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={() => refetch()}
					>
						<Text style={styles.retryButtonText}>Thử lại</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	// Use the correct data for rendering
	const displayData = requestDetails; // Show error state
	if (error || !requestDetails) {
		return (
			<View style={styles.container}>
				<Header
					title="Chi tiết yêu cầu"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
					navigation={navigation}
					showNotificationIcon={false}
					showChatIcon={false}
				/>
				<View style={styles.errorContainer}>
					<Ionicons
						name="alert-circle-outline"
						size={64}
						color="#ccc"
					/>
					<Text style={styles.errorText}>
						{error?.message || "Không thể tải thông tin yêu cầu"}
					</Text>
					<TouchableOpacity
						style={styles.retryButton}
						onPress={() => refetch()}
					>
						<Text style={styles.retryButtonText}>Thử lại</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Header
				title="Chi tiết yêu cầu"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
				navigation={navigation}
				showNotificationIcon={false}
			/>

			<ScrollView
				style={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[
					styles.scrollContent,
					shouldShowQuotation(displayData?.status) &&
						styles.scrollContentWithButton,
				]}
			>
				{/* Request Card - Without product count */}
				<View style={styles.section}>
					<View style={styles.requestCard}>
						{/* Header Section */}
						<View style={styles.cardHeader}>
							<View style={styles.leftSection}>
								<View style={styles.requestTypeContainer}>
									<Ionicons
										name={getRequestTypeIcon(
											displayData?.requestType ||
												displayData?.type
										)}
										size={18}
										color={getRequestTypeBorderColor(
											displayData?.requestType ||
												displayData?.type
										)}
									/>
								</View>

								<View style={styles.requestInfo}>
									<Text style={styles.requestCode}>
										{getShortId(
											displayData?.id || displayData?.code
										)}
									</Text>
									<Text style={styles.createdDate}>
										{formatDate(displayData?.createdAt)}
									</Text>
								</View>
							</View>

							<View
								style={[
									styles.statusBadge,
									{
										backgroundColor:
											getStatusColor(
												displayData?.status
											) + "20",
									},
								]}
							>
								<Text
									style={[
										styles.statusText,
										{
											color: getStatusColor(
												displayData?.status
											),
										},
									]}
								>
									{getStatusText(displayData?.status)}
								</Text>
							</View>
						</View>

						{/* Request Type Section */}
						<View style={styles.typeSection}>
							<Text style={styles.typeLabel}>Loại yêu cầu:</Text>
							<Text
								style={[
									styles.typeValue,
									{
										color: getRequestTypeBorderColor(
											displayData?.requestType ||
												displayData?.type
										),
									},
								]}
							>
								{getRequestTypeText(
									displayData?.requestType ||
										displayData?.type ||
										displayData?.category ||
										displayData?.purchaseType
								)}
							</Text>
						</View>
					</View>
				</View>

				{/* Request History - Show only view details button */}
				<View style={styles.section}>
					<TouchableOpacity
						style={styles.historyViewButton}
						onPress={() =>
							navigation.navigate("RequestHistory", {
								request: displayData,
							})
						}
					>
						<View style={styles.historyViewLeft}>
							<Ionicons
								name="time-outline"
								size={20}
								color="#1976D2"
							/>
							<Text style={styles.historyViewTitle}>
								Lịch sử yêu cầu
							</Text>
						</View>
						<View style={styles.historyViewRight}>
							<Text style={styles.viewDetailsText}>
								Xem chi tiết
							</Text>
							<Ionicons
								name="chevron-forward-outline"
								size={20}
								color="#1976D2"
							/>
						</View>
					</TouchableOpacity>
				</View>

				{/* Delivery Address */}
				<View style={styles.section}>
					<AddressSmCard
						recipientName={
							displayData?.shippingAddress?.name ||
							displayData?.deliveryAddress?.name ||
							displayData?.address?.recipientName ||
							displayData?.recipientName ||
							""
						}
						phone={
							displayData?.shippingAddress?.phoneNumber ||
							displayData?.deliveryAddress?.phoneNumber ||
							displayData?.address?.phone ||
							displayData?.phone ||
							""
						}
						address={
							displayData?.shippingAddress?.location ||
							displayData?.deliveryAddress?.location ||
							displayData?.address?.address ||
							displayData?.address ||
							""
						}
						isDefault={
							displayData?.shippingAddress?.default ||
							displayData?.deliveryAddress?.default ||
							displayData?.address?.isDefault ||
							false
						}
						onEdit={() => {}} // Disable edit in details view
						isEmpty={
							!(
								displayData?.shippingAddress?.name ||
								displayData?.deliveryAddress?.name ||
								displayData?.address?.recipientName ||
								displayData?.recipientName ||
								displayData?.shippingAddress?.phoneNumber ||
								displayData?.deliveryAddress?.phoneNumber ||
								displayData?.address?.phone ||
								displayData?.phone ||
								displayData?.shippingAddress?.location ||
								displayData?.deliveryAddress?.location ||
								displayData?.address?.address ||
								displayData?.address
							)
						}
						showEditButton={false}
					/>
				</View>

				{/* Store Information - Show only for OFFLINE requests */}
				{(displayData?.requestType?.toLowerCase() === "offline" ||
					displayData?.type?.toLowerCase() === "offline") &&
					(() => {
						// Extract store info from displayData.store OR subRequests.contactInfo
						let storeInfo = null;

						// Method 1: Direct store object
						if (displayData?.store) {
							storeInfo = {
								storeName:
									displayData.store.storeName ||
									displayData.store.name ||
									"",
								storeAddress:
									displayData.store.storeAddress ||
									displayData.store.address ||
									"",
								phoneNumber:
									displayData.store.phoneNumber ||
									displayData.store.phone ||
									"",
								email: displayData.store.email || "",
								shopLink:
									displayData.store.shopLink ||
									displayData.store.storeLink ||
									"",
							};
						}
						// Method 2: Extract from subRequests.contactInfo
						else if (displayData?.subRequests?.length > 0) {
							const firstSubRequest = displayData.subRequests[0];
							if (
								firstSubRequest?.contactInfo &&
								Array.isArray(firstSubRequest.contactInfo)
							) {
								const contactInfo = firstSubRequest.contactInfo;

								// Parse contactInfo array to extract store details
								const parseContactInfo = (infoArray) => {
									const parsed = {
										storeName: "",
										storeAddress: "",
										phoneNumber: "",
										email: "",
										shopLink: "",
									};

									infoArray.forEach((info) => {
										if (typeof info === "string") {
											if (
												info.includes(
													"Tên cửa hàng:"
												) ||
												info.includes("Store:")
											) {
												parsed.storeName = info
													.replace(
														"Tên cửa hàng:",
														""
													)
													.replace("Store:", "")
													.trim();
											} else if (
												info.includes("Địa chỉ:") ||
												info.includes("Address:")
											) {
												parsed.storeAddress = info
													.replace("Địa chỉ:", "")
													.replace("Address:", "")
													.trim();
											} else if (
												info.includes("SĐT:") ||
												info.includes("Phone:") ||
												info.includes("Số điện thoại:")
											) {
												parsed.phoneNumber = info
													.replace("SĐT:", "")
													.replace("Phone:", "")
													.replace(
														"Số điện thoại:",
														""
													)
													.trim();
											} else if (
												info.includes("Email:") ||
												info.includes("@")
											) {
												parsed.email = info
													.replace("Email:", "")
													.trim();
											} else if (
												info.includes("Link:") ||
												info.includes("Link shop:") ||
												info.includes("http")
											) {
												parsed.shopLink = info
													.replace("Link:", "")
													.replace("Link shop:", "")
													.trim();
											}
										}
									});

									return parsed;
								};

								storeInfo = parseContactInfo(contactInfo);
							}
						}

						// Only render if we have store info
						if (
							storeInfo &&
							(storeInfo.storeName ||
								storeInfo.storeAddress ||
								storeInfo.phoneNumber)
						) {
							return (
								<View style={styles.section}>
									<StoreCard
										storeName={storeInfo.storeName}
										storeAddress={storeInfo.storeAddress}
										phoneNumber={storeInfo.phoneNumber}
										email={storeInfo.email}
										shopLink={storeInfo.shopLink}
										mode="manual"
										showEditButton={false}
									/>
								</View>
							);
						}

						return null;
					})()}

				{/* Product List by Sub-Requests */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>
							Danh sách sản phẩm (
							{(() => {
								// Calculate total products from all sources
								if (displayData?.requestItems?.length > 0) {
									return displayData.requestItems.length;
								} else if (displayData?.items?.length > 0) {
									return displayData.items.length;
								} else if (displayData?.products?.length > 0) {
									return displayData.products.length;
								} else if (
									displayData?.productList?.length > 0
								) {
									return displayData.productList.length;
								} else if (
									displayData?.subRequests?.length > 0
								) {
									let totalProducts = 0;
									displayData.subRequests.forEach(
										(subRequest) => {
											if (
												subRequest?.requestItems
													?.length > 0
											) {
												totalProducts +=
													subRequest.requestItems
														.length;
											}
										}
									);
									return totalProducts;
								}
								return 0;
							})()}{" "}
							sản phẩm)
						</Text>
					</View>

					{/* Check if we have sub-requests structure or direct products */}
					{(() => {
						// Method 1: If we have sub-requests, show by sub-request structure
						if (displayData?.subRequests?.length > 0) {
							return displayData.subRequests
								.map((subRequest, subIndex) => {
									if (!subRequest?.requestItems?.length)
										return null;

									// Check if this sub-request has quotation
									const hasQuotation =
										subRequest.requestItems.some(
											(item) =>
												item?.quotationDetail &&
												Object.keys(
													item.quotationDetail
												).length > 0
										);

									// Calculate sub-request total if has quotation
									let subRequestTotal = 0;
									if (hasQuotation) {
										subRequest.requestItems.forEach(
											(item) => {
												if (
													item?.quotationDetail
														?.totalVNDPrice
												) {
													subRequestTotal +=
														item.quotationDetail
															.totalVNDPrice;
												}
											}
										);
									}

									return (
										<View
											key={`sub-${subIndex}`}
											style={styles.subRequestContainer}
										>
											{/* Sub-Request Header with Platform/Seller Info */}
											<View
												style={
													styles.subRequestHeaderContainer
												}
											>
												<View
													style={
														styles.subRequestHeaderLeft
													}
												>
													<PlatformLogo
														platform={
															subRequest.platform ||
															subRequest.ecommercePlatform
														}
														productUrl={
															subRequest
																.requestItems?.[0]
																?.productURL ||
															subRequest
																.requestItems?.[0]
																?.productLink ||
															subRequest
																.requestItems?.[0]
																?.url
														}
														size={20}
														color="#1976D2"
													/>
													<View
														style={
															styles.subRequestHeaderInfo
														}
													>
														<Text
															style={
																styles.subRequestHeaderTitle
															}
														>
															{subRequest.platform ||
																subRequest.ecommercePlatform ||
																"Tự tìm kiếm"}
														</Text>
														<Text
															style={
																styles.subRequestHeaderSubtitle
															}
														>
															{
																subRequest
																	.requestItems
																	.length
															}{" "}
															sản phẩm
															{subRequest.seller &&
																` • ${subRequest.seller}`}
														</Text>
													</View>
												</View>
												{hasQuotation && (
													<View
														style={
															styles.subRequestHeaderRight
														}
													>
														<View
															style={
																styles.quotationBadge
															}
														>
															<Text
																style={
																	styles.quotationBadgeText
																}
															>
																Đã báo giá
															</Text>
														</View>
													</View>
												)}
											</View>

											{/* Products in this sub-request */}
											<View
												style={
													styles.subRequestProductsContainer
												}
											>
												{subRequest.requestItems.map(
													(product, productIndex) => {
														// Determine product mode based on request type
														const productMode =
															displayData?.requestType?.toLowerCase() ===
																"online" ||
															displayData?.type?.toLowerCase() ===
																"online"
																? "withLink"
																: "manual";

														// Parse variants array to extract color, size, and other info
														const parseVariants = (
															variants
														) => {
															if (
																!variants ||
																!Array.isArray(
																	variants
																)
															)
																return {};

															const result = {};
															variants.forEach(
																(variant) => {
																	if (
																		typeof variant ===
																		"string"
																	) {
																		if (
																			variant.includes(
																				"Màu sắc:"
																			)
																		) {
																			result.color =
																				variant
																					.replace(
																						"Màu sắc:",
																						""
																					)
																					.trim();
																		} else if (
																			variant.includes(
																				"Kích cỡ:"
																			)
																		) {
																			result.size =
																				variant
																					.replace(
																						"Kích cỡ:",
																						""
																					)
																					.trim();
																		} else if (
																			variant.includes(
																				"Chất liệu:"
																			)
																		) {
																			result.material =
																				variant
																					.replace(
																						"Chất liệu:",
																						""
																					)
																					.trim();
																		} else if (
																			variant.includes(
																				"Thương hiệu:"
																			)
																		) {
																			result.brand =
																				variant
																					.replace(
																						"Thương hiệu:",
																						""
																					)
																					.trim();
																		}
																	}
																}
															);
															return result;
														};

														const parsedVariants =
															parseVariants(
																product.variants
															);

														return (
															<ProductCard
																key={`${subIndex}-${productIndex}`}
																id={
																	product.id ||
																	`${subIndex}-${productIndex}`
																}
																name={
																	product.productName ||
																	product.name ||
																	"Sản phẩm không tên"
																}
																description={
																	product.description ||
																	product.productDescription
																}
																images={
																	product.images ||
																	product.productImages ||
																	[]
																}
																price={
																	productMode ===
																	"manual"
																		? ""
																		: product.price ||
																		  product.productPrice ||
																		  ""
																}
																convertedPrice={
																	productMode ===
																	"manual"
																		? ""
																		: product.convertedPrice
																}
																exchangeRate={
																	productMode ===
																	"manual"
																		? undefined
																		: product.exchangeRate
																}
																category={
																	product.category ||
																	product.productCategory ||
																	parsedVariants.category
																}
																brand={
																	product.brand ||
																	product.productBrand ||
																	parsedVariants.brand
																}
																material={
																	product.material ||
																	product.productMaterial ||
																	parsedVariants.material
																}
																size={
																	product.size ||
																	product.productSize ||
																	parsedVariants.size
																}
																color={
																	product.color ||
																	product.productColor ||
																	parsedVariants.color
																}
																platform={
																	product.platform ||
																	product.ecommercePlatform
																}
																productLink={
																	product.productURL ||
																	product.productLink ||
																	product.url
																}
																quantity={
																	product.quantity ||
																	1
																}
																mode={
																	productMode
																}
																sellerInfo={
																	productMode ===
																	"manual"
																		? {
																				name:
																					product.sellerName ||
																					"",
																				phone:
																					product.sellerPhone ||
																					"",
																				email:
																					product.sellerEmail ||
																					"",
																				address:
																					product.sellerAddress ||
																					"",
																				storeLink:
																					product.sellerStoreLink ||
																					"",
																		  }
																		: undefined
																}
															/>
														);
													}
												)}
											</View>

											{/* Quotation for this sub-request */}
											{hasQuotation &&
												shouldShowQuotation(
													displayData?.status
												) && (
													<View
														style={
															styles.subRequestQuotation
														}
													>
														{/* Quotation Summary */}
														<View
															style={
																styles.quotationSummaryContainer
															}
														>
															<TouchableOpacity
																style={
																	styles.quotationSummaryHeader
																}
																onPress={() =>
																	setExpandedQuotations(
																		(
																			prev
																		) => ({
																			...prev,
																			[subIndex]:
																				!prev[
																					subIndex
																				],
																		})
																	)
																}
																activeOpacity={
																	0.7
																}
															>
																<View
																	style={
																		styles.quotationSummaryLeft
																	}
																>
																	<Ionicons
																		name="receipt-outline"
																		size={
																			20
																		}
																		color="#1976D2"
																	/>
																	<Text
																		style={
																			styles.quotationSummaryTitle
																		}
																	>
																		Báo giá
																	</Text>
																</View>
																<View
																	style={
																		styles.quotationSummaryRight
																	}
																>
																	<Text
																		style={
																			styles.quotationSummaryTotal
																		}
																	>
																		{subRequestTotal.toLocaleString(
																			"vi-VN"
																		)}
																		₫
																	</Text>
																	<Ionicons
																		name={
																			expandedQuotations[
																				subIndex
																			]
																				? "chevron-up-outline"
																				: "chevron-down-outline"
																		}
																		size={
																			20
																		}
																		color="#666"
																	/>
																</View>
															</TouchableOpacity>

															{/* Expanded Quotation Details */}
															{expandedQuotations[
																subIndex
															] && (
																<View
																	style={
																		styles.quotationDetailsContainer
																	}
																>
																	{subRequest.requestItems
																		.map(
																			(
																				product,
																				productIndex
																			) => {
																				const quotationDetail =
																					product?.quotationDetail;
																				if (
																					!quotationDetail ||
																					Object.keys(
																						quotationDetail
																					)
																						.length ===
																						0
																				) {
																					return null;
																				}

																				// Extract values from quotationDetail
																				const basePrice =
																					quotationDetail?.basePrice ||
																					0;
																				const serviceFee =
																					quotationDetail?.serviceFee ||
																					0;
																				const totalTaxAmount =
																					quotationDetail?.totalTaxAmount ||
																					0;
																				const totalVNDPrice =
																					quotationDetail?.totalVNDPrice ||
																					0;
																				const exchangeRate =
																					quotationDetail?.exchangeRate ||
																					1;
																				const currency =
																					quotationDetail?.currency ||
																					"USD";
																				const taxRates =
																					quotationDetail?.taxRates ||
																					[];

																				// Calculate VND values
																				const productPriceVND =
																					Math.round(
																						basePrice *
																							exchangeRate
																					);
																				const serviceFeeVND =
																					Math.round(
																						((serviceFee *
																							exchangeRate) /
																							100) *
																							basePrice
																					);
																				const importTaxVND =
																					Math.round(
																						totalTaxAmount *
																							exchangeRate
																					);

																				// Prepare tax details if available in quotationDetail
																				const taxDetails =
																					quotationDetail?.taxBreakdown
																						? {
																								importDuty:
																									quotationDetail
																										.taxBreakdown
																										.importDuty ||
																									0,
																								vat:
																									quotationDetail
																										.taxBreakdown
																										.vat ||
																									0,
																								specialConsumptionTax:
																									quotationDetail
																										.taxBreakdown
																										.specialConsumptionTax ||
																									0,
																								environmentTax:
																									quotationDetail
																										.taxBreakdown
																										.environmentTax ||
																									0,
																								totalTaxAmount:
																									totalTaxAmount,
																						  }
																						: undefined;

																				return (
																					<View
																						key={`${subIndex}-${productIndex}-quotation`}
																						style={
																							styles.quotationContainer
																						}
																					>
																						<QuotationCard
																							// Original price data
																							originalProductPrice={
																								basePrice
																							}
																							originalCurrency={
																								currency
																							}
																							exchangeRate={
																								exchangeRate
																							}
																							// VND converted prices
																							productPrice={
																								productPriceVND
																							}
																							serviceFee={
																								serviceFeeVND
																							}
																							serviceFeePercent={
																								serviceFee
																							}
																							internationalShipping={
																								0
																							} // Not specified in quotationDetail
																							importTax={
																								importTaxVND
																							}
																							domesticShipping={
																								0
																							} // Not specified in quotationDetail
																							// Tax details (legacy format)
																							taxDetails={
																								taxDetails
																							}
																							// Tax rates from API
																							taxRates={
																								taxRates
																							}
																							// Total amount
																							totalAmount={Math.round(
																								totalVNDPrice
																							)}
																							additionalFees={
																								undefined
																							}
																							updatedTotalAmount={
																								undefined
																							}
																							isExpanded={
																								false
																							}
																						/>
																					</View>
																				);
																			}
																		)
																		.filter(
																			Boolean
																		)}
																</View>
															)}
														</View>

														{/* Payment Section for this sub-request */}
														<View
															style={
																styles.subRequestPayment
															}
														>
															<View
																style={
																	styles.subRequestCheckbox
																}
															>
																<TouchableOpacity
																	style={[
																		styles.checkbox,
																		acceptedQuotations[
																			subIndex
																		] &&
																			styles.checkboxChecked,
																	]}
																	onPress={() =>
																		setAcceptedQuotations(
																			(
																				prev
																			) => ({
																				...prev,
																				[subIndex]:
																					!prev[
																						subIndex
																					],
																			})
																		)
																	}
																	activeOpacity={
																		0.7
																	}
																>
																	{acceptedQuotations[
																		subIndex
																	] && (
																		<Ionicons
																			name="checkmark"
																			size={
																				16
																			}
																			color="#FFFFFF"
																		/>
																	)}
																</TouchableOpacity>
																<Text
																	style={
																		styles.checkboxText
																	}
																>
																	Tôi đồng ý
																	với báo giá
																	này và chấp
																	nhận phí
																	phát sinh
																	(nếu có)
																</Text>
															</View>

															<TouchableOpacity
																style={[
																	styles.subRequestPayButton,
																	!acceptedQuotations[
																		subIndex
																	] &&
																		styles.subRequestPayButtonDisabled,
																]}
																onPress={() => {
																	if (
																		acceptedQuotations[
																			subIndex
																		]
																	) {
																		navigation.navigate(
																			"ConfirmQuotation",
																			{
																				request:
																					displayData,
																				subRequest:
																					subRequest,
																				subRequestIndex:
																					subIndex,
																			}
																		);
																	}
																}}
																disabled={
																	!acceptedQuotations[
																		subIndex
																	]
																}
																activeOpacity={
																	0.7
																}
															>
																<Text
																	style={[
																		styles.subRequestPayButtonText,
																		!acceptedQuotations[
																			subIndex
																		] &&
																			styles.subRequestPayButtonTextDisabled,
																	]}
																>
																	Thanh toán
																</Text>
															</TouchableOpacity>
														</View>
													</View>
												)}
										</View>
									);
								})
								.filter(Boolean);
						}

						// Method 2: Fallback for direct product arrays (legacy support)
						else {
							let allProducts = [];
							if (displayData?.requestItems?.length > 0) {
								allProducts = displayData.requestItems;
							} else if (displayData?.items?.length > 0) {
								allProducts = displayData.items;
							} else if (displayData?.products?.length > 0) {
								allProducts = displayData.products;
							} else if (displayData?.productList?.length > 0) {
								allProducts = displayData.productList;
							}

							if (allProducts.length === 0) {
								return (
									<View style={styles.emptyProductContainer}>
										<Text style={styles.emptyProductText}>
											Chưa có sản phẩm nào trong yêu cầu
											này
										</Text>
									</View>
								);
							}

							return allProducts.map((product, index) => {
								const productMode =
									displayData?.requestType?.toLowerCase() ===
										"online" ||
									displayData?.type?.toLowerCase() ===
										"online"
										? "withLink"
										: "manual";

								// Parse variants array to extract color, size, and other info
								const parseVariants = (variants) => {
									if (!variants || !Array.isArray(variants))
										return {};

									const result = {};
									variants.forEach((variant) => {
										if (typeof variant === "string") {
											if (variant.includes("Màu sắc:")) {
												result.color = variant
													.replace("Màu sắc:", "")
													.trim();
											} else if (
												variant.includes("Kích cỡ:")
											) {
												result.size = variant
													.replace("Kích cỡ:", "")
													.trim();
											} else if (
												variant.includes("Chất liệu:")
											) {
												result.material = variant
													.replace("Chất liệu:", "")
													.trim();
											} else if (
												variant.includes("Thương hiệu:")
											) {
												result.brand = variant
													.replace("Thương hiệu:", "")
													.trim();
											}
										}
									});
									return result;
								};

								const parsedVariants = parseVariants(
									product.variants
								);

								return (
									<ProductCard
										key={product.id || index}
										id={product.id || index.toString()}
										name={
											product.productName ||
											product.name ||
											"Sản phẩm không tên"
										}
										description={
											product.description ||
											product.productDescription
										}
										images={
											product.images ||
											product.productImages ||
											[]
										}
										price={
											productMode === "manual"
												? ""
												: product.price ||
												  product.productPrice ||
												  ""
										}
										convertedPrice={
											productMode === "manual"
												? ""
												: product.convertedPrice
										}
										exchangeRate={
											productMode === "manual"
												? undefined
												: product.exchangeRate
										}
										category={
											product.category ||
											product.productCategory ||
											parsedVariants.category
										}
										brand={
											product.brand ||
											product.productBrand ||
											parsedVariants.brand
										}
										material={
											product.material ||
											product.productMaterial ||
											parsedVariants.material
										}
										size={
											product.size ||
											product.productSize ||
											parsedVariants.size
										}
										color={
											product.color ||
											product.productColor ||
											parsedVariants.color
										}
										platform={
											product.platform ||
											product.ecommercePlatform
										}
										productLink={
											product.productURL ||
											product.productLink ||
											product.url
										}
										quantity={product.quantity || 1}
										mode={productMode}
										sellerInfo={
											productMode === "manual"
												? {
														name:
															product.sellerName ||
															"",
														phone:
															product.sellerPhone ||
															"",
														email:
															product.sellerEmail ||
															"",
														address:
															product.sellerAddress ||
															"",
														storeLink:
															product.sellerStoreLink ||
															"",
												  }
												: undefined
										}
									/>
								);
							});
						}
					})()}

					{/* Divider */}
					<View style={styles.divider} />
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 18,
		paddingVertical: 5,
		paddingBottom: 30,
	},
	scrollContentWithButton: {
		paddingBottom: 1,
	},
	section: {
		marginBottom: 10,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
		gap: 6,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	requestCard: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 14,
		borderLeftWidth: 4,
		borderLeftColor: "#42A5F5",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 4,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 12,
	},
	leftSection: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	requestTypeContainer: {
		backgroundColor: "#f8f9fa",
		borderRadius: 10,
		padding: 6,
		marginRight: 10,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	requestInfo: {
		flex: 1,
	},
	requestCode: {
		fontSize: 16,
		fontWeight: "700",
		color: "#343a40",
		marginBottom: 2,
	},
	createdDate: {
		fontSize: 12,
		color: "#6c757d",
		fontWeight: "500",
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 10,
		minWidth: 70,
		alignItems: "center",
	},
	statusText: {
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 0.5,
	},
	typeSection: {
		backgroundColor: "#f8f9fa",
		borderRadius: 10,
		padding: 12,
		borderWidth: 1,
		borderColor: "#e9ecef",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	typeLabel: {
		fontSize: 14,
		color: "#495057",
		fontWeight: "500",
	},
	typeValue: {
		fontSize: 14,
		fontWeight: "600",
	},
	totalSection: {
		backgroundColor: "#F3F4F6",
		padding: 10,
		borderRadius: 10,
		marginTop: 6,
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 4,
	},
	totalLabel: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
	},
	totalValue: {
		fontSize: 18,
		fontWeight: "700",
		color: "#D32F2F",
	},
	totalNote: {
		fontSize: 12,
		color: "#666",
		fontStyle: "italic",
	},
	divider: {
		height: 1,
		backgroundColor: "#E5E5E5",
		marginVertical: 8,
	},
	noteHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		marginBottom: 4,
	},
	noteHeaderLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		flex: 1,
	},
	noteContent: {
		backgroundColor: "#f8f9fa",
		padding: 12,
		borderRadius: 8,
		marginTop: 8,
	},
	noteHeaderRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	noteContainer: {
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		padding: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	noteText: {
		fontSize: 14,
		color: "#333",
		lineHeight: 20,
	},
	historyViewButton: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	historyViewLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		flex: 1,
	},
	historyViewTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	historyViewRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	viewDetailsText: {
		fontSize: 14,
		color: "#1976D2",
		fontWeight: "500",
	},
	checkboxSection: {
		marginBottom: 5,
		marginTop: -5,
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
		paddingHorizontal: 18,
		paddingVertical: 12,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 2,
		borderColor: "#D0D5DD",
		backgroundColor: "#FFFFFF",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 2, // Align with text
	},
	checkboxChecked: {
		backgroundColor: "#1976D2",
		borderColor: "#1976D2",
	},
	checkboxText: {
		fontSize: 14,
		color: "#333",
		lineHeight: 20,
		flex: 1,
	},
	fixedButtonContainer: {
		backgroundColor: "#fff",
		paddingHorizontal: 18,
		paddingVertical: 27,
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	fixedPaymentButton: {
		backgroundColor: "#1976D2",
		borderRadius: 10,
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	fixedPaymentButtonDisabled: {
		backgroundColor: "#E0E0E0",
		shadowOpacity: 0,
		elevation: 0,
	},
	fixedPaymentButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	fixedPaymentButtonTextDisabled: {
		color: "#9E9E9E",
	},
	// Loading and Error States
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 20,
	},
	loadingText: {
		fontSize: 16,
		color: "#666",
		marginTop: 16,
		textAlign: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 20,
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#dc3545",
		marginTop: 16,
		marginBottom: 8,
		textAlign: "center",
	},
	errorMessage: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		lineHeight: 20,
		marginBottom: 24,
	},
	retryButton: {
		backgroundColor: "#1976D2",
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	retryButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#fff",
	},
	emptyProductContainer: {
		backgroundColor: "#f8f9fa",
		padding: 20,
		borderRadius: 8,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E5E5E5",
		borderStyle: "dashed",
	},
	emptyProductText: {
		fontSize: 14,
		color: "#666",
		fontStyle: "italic",
	},
	// No Quotation Styles
	noQuotationContainer: {
		backgroundColor: "#f8f9fa",
		padding: 40,
		borderRadius: 12,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#E5E5E5",
		borderStyle: "dashed",
	},
	noQuotationText: {
		fontSize: 16,
		color: "#666",
		fontStyle: "italic",
		marginTop: 12,
		textAlign: "center",
	},
	// Sub-request Styles
	subRequestHeader: {
		backgroundColor: "#f8f9fa",
		padding: 12,
		borderRadius: 8,
		marginBottom: 12,
		borderLeftWidth: 3,
		borderLeftColor: "#1976D2",
	},
	subRequestTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
	},
	subRequestInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	subRequestProducts: {
		fontSize: 13,
		color: "#666",
	},
	subRequestTotal: {
		fontSize: 14,
		fontWeight: "600",
		color: "#D32F2F",
	},
	// Quotation Container Styles
	quotationContainer: {
		marginBottom: 12,
	},
	quotationHeader: {
		backgroundColor: "#fff",
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	quotationProductName: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
	},
	quotationProductQuantity: {
		fontSize: 12,
		color: "#666",
	},
	// Sub-request Payment Styles
	subRequestPayment: {
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 16,
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
	},
	subRequestCheckbox: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
		marginBottom: 16,
	},
	subRequestPayButton: {
		backgroundColor: "#1976D2",
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	subRequestPayButtonDisabled: {
		backgroundColor: "#E0E0E0",
	},
	subRequestPayButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	subRequestPayButtonTextDisabled: {
		color: "#9E9E9E",
	},
	// Quotation Summary Styles
	quotationSummaryContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		overflow: "hidden",
	},
	quotationSummaryHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#f8f9fa",
	},
	quotationSummaryLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		gap: 8,
	},
	quotationSummaryTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	quotationSummaryBadge: {
		backgroundColor: "#1976D2",
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 2,
	},
	quotationSummaryBadgeText: {
		fontSize: 12,
		color: "#fff",
		fontWeight: "500",
	},
	quotationSummaryRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	quotationSummaryTotal: {
		fontSize: 16,
		fontWeight: "700",
		color: "#D32F2F",
	},
	quotationDetailsContainer: {
		padding: 16,
		paddingTop: 0,
	},
	// Sub-request Container Styles
	subRequestContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	subRequestHeaderContainer: {
		backgroundColor: "#f8f9fa",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E5E5",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	subRequestHeaderLeft: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		gap: 10,
	},
	subRequestHeaderInfo: {
		flex: 1,
	},
	subRequestHeaderTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 2,
	},
	subRequestHeaderSubtitle: {
		fontSize: 13,
		color: "#666",
		fontWeight: "500",
	},
	subRequestHeaderRight: {
		alignItems: "flex-end",
	},
	quotationBadge: {
		backgroundColor: "#28a745",
		borderRadius: 12,
		paddingHorizontal: 8,
		paddingVertical: 4,
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	quotationBadgeText: {
		fontSize: 12,
		color: "#fff",
		fontWeight: "600",
	},
	subRequestProductsContainer: {
		padding: 16,
	},
	subRequestQuotation: {
		paddingHorizontal: 16,
		paddingBottom: 16,
	},
	subRequestTitleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	subRequestMainTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: "#333",
		flex: 1,
	},
	subRequestBadge: {
		backgroundColor: "#1976D2",
		borderRadius: 10,
		paddingHorizontal: 8,
		paddingVertical: 4,
		marginLeft: 8,
	},
	subRequestBadgeText: {
		fontSize: 12,
		color: "#fff",
		fontWeight: "600",
	},
	subRequestMetaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	subRequestProductCount: {
		fontSize: 13,
		color: "#666",
		fontWeight: "500",
	},
	subRequestTotalAmount: {
		fontSize: 15,
		fontWeight: "700",
		color: "#D32F2F",
	},
	subRequestContentContainer: {
		padding: 16,
	},
	productItemContainer: {
		backgroundColor: "#f8f9fa",
		borderRadius: 8,
		padding: 12,
		marginBottom: 12,
		borderLeftWidth: 3,
		borderLeftColor: "#42A5F5",
	},
	productItemHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 8,
	},
	productItemName: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		flex: 1,
		marginRight: 8,
	},
	productItemQuantity: {
		fontSize: 12,
		color: "#666",
		backgroundColor: "#fff",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
		fontWeight: "500",
	},
	productItemDetails: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	productItemDetail: {
		fontSize: 12,
		color: "#666",
	},
});
