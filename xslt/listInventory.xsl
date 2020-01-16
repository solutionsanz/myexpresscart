  <xsl:stylesheet xmlns:nstrgmpr="http://mulesoft.org/tshirt-service" xmlns:ora="http://schemas.oracle.com/xpath/extension" xmlns:oracle-xsl-mapper="http://www.oracle.com/xsl/mapper/schemas" xmlns:ns1="http://schemas.xmlsoap.org/soap/http" xmlns:oraext="http://www.oracle.com/XSL/Transform/java/oracle.tip.pc.services.functions.ExtFunc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:xp20="http://www.oracle.com/XSL/Transform/java/oracle.tip.pc.services.functions.Xpath20" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:ignore01="http://www.oracle.com/XSL/Transform/java" version="2.0" xml:id="id_1" exclude-result-prefixes=" ora oracle-xsl-mapper oraext xsi xsd fn xp20 xsl ignore01" ignore01:ignorexmlids="true" xmlns:dvm="http://www.oracle.com/XSL/Transform/java/com.bea.wli.sb.functions.dvm.DVMFunctions" xmlns:ns2="http://www.oracle.com/XSL/Transform/java/com.bea.wli.sb.resources.icsxpathfunctions.ICSInstanceTrackingFunctions" xmlns:ns0="http://www.oracle.com/XSL/Transform/java/oracle.tip.dvm.LookupValue" xmlns:orajs0="http://www.oracle.com/XSL/Transform/java/oracle.tip.pc.services.functions.JsExecutor_STRINGUTILLIBRARY_01_00_0000_concat_concatMessage_param1_param2">
        <oracle-xsl-mapper:schema xml:id="id_2">
              <!--SPECIFICATION OF MAP SOURCES AND TARGETS, DO NOT MODIFY.-->
              <oracle-xsl-mapper:mapSources xml:id="id_3">
                    <oracle-xsl-mapper:source type="WSDL" xml:id="id_4">
                          <oracle-xsl-mapper:schema location="../../application_8/outbound_9/resourcegroup_10/ListInventory_REQUEST.wsdl" xml:id="id_5"/>
                          <oracle-xsl-mapper:rootElement name="ListInventory" namespace="http://mulesoft.org/tshirt-service" xml:id="id_6"/>
                    </oracle-xsl-mapper:source>
              </oracle-xsl-mapper:mapSources>
              <oracle-xsl-mapper:mapTargets xml:id="id_7">
                    <oracle-xsl-mapper:target type="WSDL" xml:id="id_8">
                          <oracle-xsl-mapper:schema location="../../application_8/outbound_9/resourcegroup_10/ListInventory_REQUEST.wsdl" xml:id="id_9"/>
                          <oracle-xsl-mapper:rootElement name="ListInventoryResponse" namespace="http://mulesoft.org/tshirt-service" xml:id="id_10"/>
                    </oracle-xsl-mapper:target>
              </oracle-xsl-mapper:mapTargets>
              <!--GENERATED BY ORACLE XSL MAPPER 12.1.2.0.0-->
        </oracle-xsl-mapper:schema>
        <!--User Editing allowed BELOW this line - DO NOT DELETE THIS LINE-->
        <xsl:param name="tracking_var_1" xml:id="id_13"/>
        <xsl:param name="tracking_var_2" xml:id="id_14"/>
        <xsl:param name="tracking_var_3" xml:id="id_15"/>
        <xsl:template match="/" xml:id="id_11">
              <nstrgmpr:ListInventoryResponse xml:id="id_12">
                    <inventory>
                          <productCode>anniversary-tshirt</productCode>
                          <size>Large</size>
                          <description>Thank you for your 100 years of loyalty. We, at MuleQuest, are committed to keep exceeding your expectations. Now, we are fully digitising our business to be closer to you. This means better products, better services and lower prices for you. Let us celebrate with a limited edition T-Shirt, designed just for you.</description>
                          <count>1000</count>
                    </inventory>
                    <inventory>
                          <productCode>duckworth-jacket</productCode>
                          <size>Large</size>
                          <description>Inspired by the timeless, functional style of your grandfather's work coat, the Foraker features brass buttons and 4 patch pockets. Crafted in Bristol, Tennessee, our 10oz organic duck canvas is light enough for an early summer morning, but rugged enough to handle your days work.</description>
                          <count>100</count>
                    </inventory>
                    <inventory>
                          <productCode>5-panel-camp-cap</productCode>
                          <size>Large</size>
                          <description>A classic 5 panel hat with our United By Blue logo on the front and an adjustable strap to keep fit and secure. Made with recycled polyester and organic cotton mix.</description>
                          <count>100</count>
                    </inventory>
                    <inventory>
                          <productCode>ranger-boot</productCode>
                          <size>Large</size>
                          <description>The Mesabi Iron Range lies in northern Minnesota, a rugged and remote area known for its iron mines. The local residents who work these mines are proudly known as Iron Rangers, individuals with a sense of adventure and a determined personality. Originally designed to be worn in the iron mines, Iron Ranger work boots had to be as tough as the people who wore them in demanding conditions. Iron Ranger boots are built with a double layer of leaver over the toe to provide an extra measure of safety.</description>
                          <count>100</count>
                    </inventory>
                    <inventory>
                          <productCode>whitney-pullover</productCode>
                          <size>Large</size>
                          <description>Buttons are fussy. Sometimes you just want to roll out of bed, put on the pull over and get to the days work.</description>
                          <count>100</count>
                    </inventory>
                    <inventory>
                          <productCode>scout-backpack</productCode>
                          <size>Large</size>
                          <description>This durable backpack is ready for any adventure, large or small. Features adjustable and padded shoulder pads for comfort. Designed with a storm flap and a secured by two snap-button closure. Made with a waxed downpour proof exterior canvas and a soft cotton interior lining. Finished with brass hardware and genuine leather trimmings.</description>
                          <count>100</count>
                    </inventory>
                    <inventory>
                          <productCode>hudderton-backpack</productCode>
                          <size>Large</size>
                          <description>Durable, rugged, and dependable designed with four zipper compartments. Two bellowed front pockets allow for easy access to smaller items, one large, spacious compartment with a padded laptop sleeve, and a tiny convenient pouch on top to keep keys and other small items secure. The Hudderton is built with organic downpour proof canvas, a durable full grain leather bottom to prevent wear and tear, and padded canvas shoulder straps for all-day comfort. From the commute to the trail the Hudderton is perfect for bag for the entire week.</description>
                          <count>100</count>
                    </inventory>
                    <inventory>
                          <productCode>ayres-chambray</productCode>
                          <size>Large</size>
                          <description>Comfortable and practical, our chambray button down is perfect for travel or days spent on the go. The Ayres Chambray has a rich, washed out indigo color suitable to throw on for any event. Made with sustainable soft chambray featuring two chest pockets with sturdy and scratch resistant corozo buttons.</description>
                          <count>100</count>
                    </inventory>
                    <inventory>
                          <productCode>gym-membership</productCode>
                          <size></size>
                          <description>This a monthly recurring Gym membership subscription.</description>
                          <count>1000</count>
                    </inventory>
              </nstrgmpr:ListInventoryResponse>
        </xsl:template>
  </xsl:stylesheet>