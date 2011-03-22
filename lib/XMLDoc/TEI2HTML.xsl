<?xml version='1.0'?>
<xsl:stylesheet version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
<xsl:template match="//text">
	<HTML>
		<HEAD>
			<TITLE>DUDE</TITLE>
			<STYLE type="text/css">
				div{
					display: block;
				}
				
				.l{
				color:red;
				display: block;
				}
				.speaker{
				font-weight: bold;
				}
				#george{
				color: blue;
				}
				
			</STYLE>
		</HEAD>
		<BODY>	
		HELLO WORLD	
			<xsl:apply-templates />
	</BODY>
	</HTML>
</xsl:template>
<xsl:template match="div1">
	<xsl:for-each select=".//.">
		<div id="george" class="{name()}"><xsl:apply-templates /></div>
		
	</xsl:for-each>
	
</xsl:template>	

</xsl:stylesheet>